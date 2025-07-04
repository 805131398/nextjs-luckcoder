"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User } from "next-auth";

interface ProfileNicknameProps {
  user: User | undefined;
  onSave: (nickname: string) => Promise<void>;
}

export function ProfileNickname({ user, onSave }: ProfileNicknameProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [nickname, setNickname] = useState(user?.name || "");

  const handleSave = async () => {
    await onSave(nickname);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <Input
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="max-w-[200px]"
          placeholder="输入昵称"
        />
        <Button onClick={handleSave} size="sm">保存</Button>
        <Button onClick={() => setIsEditing(false)} variant="outline" size="sm">取消</Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-lg font-medium">{user?.name || "设置昵称"}</span>
      <Button onClick={() => setIsEditing(true)} variant="ghost" size="sm">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-4 h-4"
        >
          <path d="m5.433 13.917 1.262-3.155A4 4 0 0 1 7.58 9.42l6.92-6.918a2.121 2.121 0 0 1 3 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 0 1-.65-.65Z" />
          <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0 0 10 3H4.75A2.75 2.75 0 0 0 2 5.75v9.5A2.75 2.75 0 0 0 4.75 18h9.5A2.75 2.75 0 0 0 17 15.25V10a.75.75 0 0 0-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5Z" />
        </svg>
      </Button>
    </div>
  );
} 