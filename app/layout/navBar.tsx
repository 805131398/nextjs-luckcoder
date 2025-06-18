"use client"

import Link from "next/link";
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
            <div className="flex items-center gap-4">
                <Link href="/" className="text-lg font-bold hover:opacity-80">首页</Link>
            </div>
            <div>
                {session ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Avatar className="cursor-pointer">
                                <AvatarImage src={userAvatar} alt={userName} />
                                <AvatarFallback>{userName?.[0] || "U"}</AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem disabled>{userName}</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => signOut()}>退出登录</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    <Button onClick={() => signIn("github")}>GitHub 登录</Button>
                )}
            </div>
        </nav>
    );
}