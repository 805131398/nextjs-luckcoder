import GitHub from "next-auth/providers/github";

export const authConfig = {
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID || "Ov23liCnG3Vd4HmggBtY",
      clientSecret: process.env.GITHUB_SECRET || "572fd815e9ceae3c894d10936732b7bb08f81eb1",
    }),
  ],
  // 可扩展更多配置
}; 