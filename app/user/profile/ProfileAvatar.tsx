"use client";

import { useState, useMemo } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Camera } from "lucide-react";
import { createAvatar } from "@dicebear/core";
import * as styles from "@dicebear/collection";
import AvatarDialog, { AvatarData } from "@/components/avatar/AvatarDialog";
import { User } from "next-auth";

interface ProfileAvatarProps {
  user: User | undefined;
  onAvatarUpdate?: () => void;
}

// 默认头像数据生成
function getDefaultAvatarData(user: User | undefined): AvatarData {
  return {
    avatarType: "system",
    avatarSeed: user?.id || user?.email || "user",
    avatarStyle: "lorelei",
    avatarUrl: user?.image || undefined,
  };
}

export function ProfileAvatar({ user, onAvatarUpdate }: ProfileAvatarProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  // 这里建议实际从后端获取用户头像数据
  const [avatarData, setAvatarData] = useState<AvatarData>(getDefaultAvatarData(user));

  // 头像点击弹窗
  const handleAvatarClick = () => setIsDialogOpen(true);

  // 保存头像
  const handleSave = async (data: AvatarData) => {
    setAvatarData(data);
    setIsDialogOpen(false);
    // TODO: 这里可以调用后端API保存头像数据
    onAvatarUpdate?.();
  };

  // 生成系统头像 SVG
  const systemAvatarSvg = useMemo(() => {
    if (avatarData.avatarType === "system") {
      try {
        const styleModule = (styles as Record<string, unknown>)[avatarData.avatarStyle];
        if (styleModule) {
          return createAvatar(styleModule as any, { seed: avatarData.avatarSeed }).toString();
        }
      } catch (error) {
        console.error('生成头像失败:', error);
      }
    }
    return null;
  }, [avatarData.avatarType, avatarData.avatarSeed, avatarData.avatarStyle]);

  // 头像展示逻辑
  const renderAvatar = () => {
    if (avatarData.avatarType === "system" && systemAvatarSvg) {
      return (
        <div 
          className="w-full h-full" 
          dangerouslySetInnerHTML={{ __html: systemAvatarSvg }} 
        />
      );
    } else if (avatarData.avatarType === "custom" && avatarData.avatarUrl) {
      return <AvatarImage src={avatarData.avatarUrl} alt="用户头像" />;
    } else {
      return <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>;
    }
  };

  return (
    <>
      <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
        <Avatar className="w-16 h-16 sm:w-20 sm:h-20 transition-all duration-200 group-hover:brightness-75">
          {renderAvatar()}
        </Avatar>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-full bg-black/30">
          <Camera className="w-6 h-6 text-white" />
        </div>
      </div>
      <AvatarDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleSave}
        initialData={avatarData}
      />
    </>
  );
} 