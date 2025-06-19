"use client"

import Link from "next/link";
import { redirect } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

// TODO: 后续接入 Auth.js，动态判断登录状态
export default function NavBar() {
    const { data: session } = useSession();
    const userAvatar = session?.user?.image || undefined;
    const userName = session?.user?.name || "用户";

    return (
        <nav className="w-full flex items-center justify-between px-4 py-2 bg-white dark:bg-black shadow-sm sticky top-0 z-50">
            <div className="flex items-center gap-2 sm:gap-4">
                <Link href="/" className="text-base sm:text-lg font-bold hover:opacity-80">首页</Link>
                <Link href="/user/profile" className="text-base sm:text-lg font-bold hover:opacity-80">个人中心</Link>
            </div>
            <div className="relative">
                {session ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Avatar className="cursor-pointer h-8 w-8 sm:h-10 sm:w-10">
                                <AvatarImage src={userAvatar} alt={userName} />
                                <AvatarFallback className="text-xs sm:text-sm">{userName?.[0] || "U"}</AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent 
                            align="end" 
                            className="w-48 sm:w-56"
                            sideOffset={8}
                            alignOffset={-8}
                        >
                            <DropdownMenuItem disabled className="text-sm">
                                {userName}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                                onClick={() => signOut()}
                                className="text-sm cursor-pointer"
                            >
                                退出登录
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button size="sm" className="text-sm px-3 py-1 sm:px-4 sm:py-2">登录</Button>   
                        </DropdownMenuTrigger>
                        <DropdownMenuContent 
                            align="end" 
                            className="w-48 sm:w-56"
                            sideOffset={8}
                            alignOffset={-8}
                        >
                            <DropdownMenuItem 
                                onClick={() => signIn("github")}
                                className="text-sm cursor-pointer"
                            >
                                GitHub 登录
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                                onClick={() => signIn("google")}
                                className="text-sm cursor-pointer"
                            >
                                Google 登录
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                                onClick={() => {redirect("/login")}}
                                className="text-sm cursor-pointer"
                            >
                                邮箱验证码登录
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>
        </nav>
    );
}