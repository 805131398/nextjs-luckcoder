import NextAuth, { NextAuthConfig, Session } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";


// 1. 先定义并导出 authOptions
export const authOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  providers: [
    GitHub,
    Google,
    // 邮箱验证码登录
    Credentials({
      id: "email",
      name: "email",
      credentials: {
        email: { label: "邮箱", type: "email" },
        code: { label: "验证码", type: "text" },
      },
      async authorize(credentials) {
        console.log("开始验证邮箱凭据:", credentials);
        
        if (!credentials?.email || !credentials?.code) {
          console.log("邮箱凭据不完整");
          return null;
        }

        try {
          // 查找验证码
          const verificationToken = await prisma.verificationToken.findFirst({
            where: {
              identifier: credentials.email,
              token: credentials.code,
              expires: {
                gt: new Date(),
              },
            },
          });

          console.log("邮箱验证码查询结果:", verificationToken);

          if (!verificationToken) {
            console.log("邮箱验证码不存在或已过期");
            return null;
          }

          // 删除已使用的验证码
          await prisma.verificationToken.delete({
            where: {
              identifier: credentials.email,
              token: credentials.code as string,
            },
          });

          console.log("邮箱验证码已删除");

          // 查找或创建用户
          let user = await prisma.user.findUnique({
            where: { email: credentials.email as string },
          });

          console.log("邮箱用户查询结果:", user);

          if (!user) {
            // 创建新用户
            user = await prisma.user.create({
              data: {
                email: credentials.email as string,
                emailVerified: new Date(),
              },
            });
            console.log("新邮箱用户已创建:", user);
            
            // 设置默认头像风格和种子
            await prisma.user.update({
              where: { id: user.id },
              data: {
                avatarType: "system",
                avatarStyle: "lorelei",
                avatarSeed: user.id,
              },
            });
            // 为新用户创建账户记录
            await prisma.account.create({
              data: {
                userId: user.id,
                type: "credentials",
                provider: "email",
                providerAccountId: credentials.email as string,
              },
            });
            console.log("为新用户创建了邮箱验证码账户记录");
          } else {
            // 检查用户是否已有邮箱验证码的账户记录
            const existingAccount = await prisma.account.findFirst({
              where: {
                userId: user.id,
                provider: "email",
              },
            });

            // 如果没有账户记录，创建一个
            if (!existingAccount) {
              await prisma.account.create({
                data: {
                  userId: user.id,
                  type: "credentials",
                  provider: "email",
                  providerAccountId: credentials.email as string,
                },
              });
              console.log("为用户创建了邮箱验证码账户记录");
            }
          }

          const result = {
            id: user.id,
            email: user.email || "",
            phone: user.phone || "",
            name: user.name || "",
            image: user.image || "",
          };

          console.log("返回邮箱用户信息:", result);
          return result;
        } catch (error) {
          console.error("邮箱验证码登录失败:", error);
          return null;
        }
      },
    }),
    // 手机号验证码登录
    Credentials({
      id: "phone_code",
      name: "phone_code",
      credentials: {
        phone: { label: "手机号", type: "tel" },
        code: { label: "验证码", type: "text" },
      },
      async authorize(credentials) {
        console.log("开始验证手机号凭据:", credentials);
        
        if (!credentials?.phone || !credentials?.code) {
          console.log("手机号凭据不完整");
          return null;
        }

        try {
          // 查找验证码
          const verificationToken = await prisma.verificationToken.findFirst({
            where: {
              identifier: credentials.phone,
              token: credentials.code,
              expires: {
                gt: new Date(),
              },
            },
          });

          console.log("手机号验证码查询结果:", verificationToken);

          if (!verificationToken) {
            console.log("手机号验证码不存在或已过期");
            return null;
          }

          // 删除已使用的验证码
          await prisma.verificationToken.delete({
            where: {
              identifier: credentials.phone,
              token: credentials.code as string,
            },
          });

          console.log("手机号验证码已删除");

          // 查找或创建用户
          let user = await prisma.user.findUnique({
            where: { phone: credentials.phone as string },
          });

          console.log("手机号用户查询结果:", user);

          if (!user) {
            // 创建新用户（自动注册）
            user = await prisma.user.create({
              data: {
                phone: credentials.phone as string,
                name: `用户${(credentials.phone as string).slice(-4)}`, // 默认昵称：用户+手机号后4位
                avatarType: "system",
                avatarStyle: "lorelei",
                avatarSeed: credentials.phone as string,
              },
            });
            console.log("新手机号用户已创建:", user);
            
            // 为新用户创建账户记录
            await prisma.account.create({
              data: {
                userId: user.id,
                type: "credentials",
                provider: "phone_code",
                providerAccountId: credentials.phone as string,
              },
            });
            console.log("为新用户创建了手机号验证码账户记录");
          } else {
            // 检查用户是否已有手机号验证码的账户记录
            const existingAccount = await prisma.account.findFirst({
              where: {
                userId: user.id,
                provider: "phone_code",
              },
            });

            // 如果没有账户记录，创建一个
            if (!existingAccount) {
              await prisma.account.create({
                data: {
                  userId: user.id,
                  type: "credentials",
                  provider: "phone_code",
                  providerAccountId: credentials.phone as string,
                },
              });
              console.log("为用户创建了手机号验证码账户记录");
            }
          }

          const result = {
            id: user.id,
            email: user.email || "",
            phone: user.phone || "",
            name: user.name || "",
            image: user.image || "",
          };

          console.log("返回手机号用户信息:", result);
          return result;
        } catch (error) {
          console.error("手机号验证码登录失败:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }: { session: Session, token: { email: string, phone: string } }) {
      
      if (token?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email as string },
        });
        
        if (dbUser) {
          session.user = {
            ...session.user,
            id: dbUser.id,
            email: dbUser.email || "",
            phone: dbUser.phone || "",
            name: dbUser.name || "",
            image: dbUser.image || "",
          };
        }
      } else if (token?.phone) {
        const dbUser = await prisma.user.findUnique({
          where: { phone: token.phone as string },
        });
        
        if (dbUser) {
          session.user = {
            ...session.user,
            id: dbUser.id,
            email: dbUser.email || "",
            phone: dbUser.phone || "",
            name: dbUser.name || "",
            image: dbUser.image || "",
          };
        }
      }
      
      return session;
    },
    async jwt({ token, user }: { token: { id: string, email: string, phone: string, name: string, image: string }, user: { id: string, email: string, phone: string, name: string, image: string } }) {
      
      if (user) {
        token.id = user.id;
        token.email = user.email || "";
        token.phone = user.phone || "";
        token.name = user.name || "";
        token.image = user.image || "";
      }
      return token;
    },
  },
  pages: {
    signIn: "/login",
  },
  debug: true,
};

// 2. 用 NextAuth(authOptions) 初始化
export const { auth, handlers, signIn, signOut } = NextAuth(authOptions as unknown as NextAuthConfig); 