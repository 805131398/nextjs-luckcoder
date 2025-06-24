import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  try {
    // 验证用户会话
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "未授权" }, { status: 401 });
    }

    // 获取上传的文件
    const formData = await request.formData();
    const file = formData.get("avatar") as File;
    
    if (!file) {
      return NextResponse.json({ message: "未选择文件" }, { status: 400 });
    }

    // 验证文件类型
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ message: "请上传图片文件" }, { status: 400 });
    }

    // 验证文件大小 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ message: "图片大小不能超过5MB" }, { status: 400 });
    }

    // 生成唯一文件名
    const fileExtension = file.name.split(".").pop() || "jpg";
    const fileName = `${uuidv4()}.${fileExtension}`;
    
    // 确保上传目录存在
    const uploadDir = join(process.cwd(), "public", "uploads", "avatars");
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch {
      // 目录可能已存在，忽略错误
    }

    // 保存文件
    const filePath = join(uploadDir, fileName);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    await writeFile(filePath, buffer);

    // 构建文件访问URL
    const imageUrl = `/uploads/avatars/${fileName}`;

    // 更新数据库中的用户头像
    await prisma.user.update({
      where: { id: session.user.id },
      data: { image: imageUrl },
    });

    return NextResponse.json({ 
      message: "头像上传成功", 
      imageUrl 
    });

  } catch (error) {
    console.error("头像上传失败:", error);
    return NextResponse.json(
      { message: "服务器错误，请稍后重试" }, 
      { status: 500 }
    );
  }
} 