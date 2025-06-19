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
      id: "email-code",
      name: "email-code",
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
              token: credentials.code,
            },
          });

          console.log("验证码已删除");

          // 查找或创建用户
          let user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          console.log("用户查询结果:", user);

          if (!user) {
            // 创建新用户
            user = await prisma.user.create({
              data: {
                email: credentials.email,
                emailVerified: new Date(),
              },
            });
            console.log("新用户已创建:", user);
          }

          const result = {
            id: user.id,
            email: user.email ?? "",
            name: user.name ?? "",
            image: user.image ?? "",
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
      console.log("Session callback - session:", session);
      console.log("Session callback - token:", token);
      
      if (token?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email as string },
        });
        
        console.log("Session callback - dbUser:", dbUser);
        
        if (dbUser) {
          session.user = {
            ...session.user,
            id: dbUser.id,
            email: dbUser.email,
            name: dbUser.name,
            image: dbUser.image,
          };
        }
      }
      
      console.log("Session callback - final session:", session);
      return session;
    },
    async jwt({ token, user }) {
      console.log("JWT callback - token:", token);
      console.log("JWT callback - user:", user);
      
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
      }
      
      console.log("JWT callback - final token:", token);
      return token;
    },
  },
  pages: {
    signIn: "/login",
  },
  debug: true,
}); 