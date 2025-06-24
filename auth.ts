import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  providers: [
    GitHub,
    Google,
    Credentials({
      id: "email",
      name: "email",
      credentials: {
        email: { label: "邮箱", type: "email" },
        code: { label: "验证码", type: "text" },
      },
      async authorize(credentials) {
        console.log("开始验证凭据:", credentials);
        
        if (!credentials?.email || !credentials?.code) {
          console.log("凭据不完整");
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

          console.log("验证码查询结果:", verificationToken);

          if (!verificationToken) {
            console.log("验证码不存在或已过期");
            return null;
          }

          // 删除已使用的验证码
          await prisma.verificationToken.delete({
            where: {
              identifier: credentials.email,
              token: credentials.code as string,
            },
          });

          console.log("验证码已删除");

          // 查找或创建用户
          let user = await prisma.user.findUnique({
            where: { email: credentials.email as string },
          });

          console.log("用户查询结果:", user);

          if (!user) {
            // 创建新用户
            user = await prisma.user.create({
              data: {
                email: credentials.email as string,
                emailVerified: new Date(),
              },
            });
            console.log("新用户已创建:", user);
            
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
            name: user.name || "",
            image: user.image || "",
          };

          console.log("返回用户信息:", result);
          return result;
        } catch (error) {
          console.error("邮箱验证码登录失败:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      
      if (token?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email as string },
        });
        
        
        if (dbUser) {
          session.user = {
            ...session.user,
            id: dbUser.id,
            email: dbUser.email || "",
            name: dbUser.name || "",
            image: dbUser.image || "",
          };
        }
      }
      
      return session;
    },
    async jwt({ token, user }) {
      
      if (user) {
        token.id = user.id;
        token.email = user.email || "";
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
}); 