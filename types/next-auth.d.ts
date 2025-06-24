import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      phone?: string
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    phone?: string
    avatarType?: "system" | "custom"
    avatarStyle?: string
    avatarSeed?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    phone?: string
    avatarType?: string
    avatarStyle?: string
    avatarSeed?: string
  }
} 