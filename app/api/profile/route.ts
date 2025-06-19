import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  console.log(session);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const { nickname } = await req.json();
  await prisma.user.update({
    where: { email: session.user.email },
    data: { name: nickname }
  });
  return NextResponse.json({ success: true });
}

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { name: true, email: true, image: true, id: true }
  });
  const account = await prisma.account.findFirst({
    where: { user: { email: session.user.email } },
    select: { provider: true }
  });
  return NextResponse.json({ ...user, provider: account?.provider || null });
} 