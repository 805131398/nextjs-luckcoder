import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";

const prisma = new PrismaClient();

// 创建邮件传输器
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// 生成 6 位数字验证码
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { error: "请输入有效的邮箱地址" },
        { status: 400 }
      );
    }

    // 生成验证码
    const code = generateVerificationCode();
    const expires = new Date(Date.now() + 5 * 60 * 1000); // 5分钟后过期

    // 删除该邮箱之前的验证码
    await prisma.verificationToken.deleteMany({
      where: { identifier: email },
    });

    // 保存新的验证码
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: code,
        expires,
      },
    });

    // 发送邮件
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: "登录验证码",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">您的登录验证码</h2>
          <p>您好！</p>
          <p>您的登录验证码是：</p>
          <div style="background-color: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0;">
            <h1 style="color: #007bff; font-size: 32px; margin: 0; letter-spacing: 5px;">${code}</h1>
          </div>
          <p>验证码有效期为 5 分钟，请尽快使用。</p>
          <p>如果这不是您的操作，请忽略此邮件。</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">此邮件由系统自动发送，请勿回复。</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    console.log("验证码已发送到您的邮箱", email, code);

    return NextResponse.json(
      { message: "验证码已发送到您的邮箱" },
      { status: 200 }
    );
  } catch (error) {
    console.error("发送验证码失败:", error);
    return NextResponse.json(
      { error: "发送验证码失败，请稍后重试" },
      { status: 500 }
    );
  }
} 