/** @format */

"use client";

import { useState, useMemo, useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Camera } from "lucide-react";
import { createAvatar } from "@dicebear/core";
import * as styles from "@dicebear/collection";
import AvatarDialog, { AvatarData } from "@/components/avatar/AvatarDialog";
import { useProfileStore } from "@/lib/store/profile-store";
import { Buffer } from "buffer";
import { OssAvatar } from "@/components/ui/oss-image";
import type { Style } from "@dicebear/core";
import type { User } from "next-auth";

interface ProfileAvatarProps {
  onAvatarUpdate?: () => void;
}

// 默认头像数据生成
function getDefaultAvatarData(profile: User | null | undefined): AvatarData {
  return {
    avatarType: (profile?.avatarType as "system" | "custom") || "custom",
    avatarSeed: profile?.avatarSeed || profile?.id || profile?.email || "user",
    avatarStyle: profile?.avatarStyle || "lorelei",
    avatarUrl: profile?.image || undefined,
  };
}

export function ProfileAvatar({ onAvatarUpdate }: ProfileAvatarProps) {
  const { profile } = useProfileStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [avatarData, setAvatarData] = useState<AvatarData>(getDefaultAvatarData(profile));

  useEffect(() => {
    setAvatarData(getDefaultAvatarData(profile));
  }, [profile]);

  // 头像点击弹窗
  const handleAvatarClick = () => setIsDialogOpen(true);

  // 保存头像
  const handleSave = async (data: AvatarData) => {
    setAvatarData(data);
    setIsDialogOpen(false);

    console.log(data, "保存头像");

    // 只保存系统头像的风格和种子
    if (data.avatarType === "system") {
      await fetch("/api/profile/avatar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          avatarType: "system",
          avatarStyle: data.avatarStyle,
          avatarSeed: data.avatarSeed,
        }),
      });
    } else if (data.avatarType === "custom") {
      // 保存自定义头像（图片 URL）
      await fetch("/api/profile/avatar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          avatarType: "custom",
          avatarUrl: data.avatarUrl, // 这里已经是 OSS URL
        }),
      });
    }
    onAvatarUpdate?.();
  };

  // 生成系统头像 SVG
  const systemAvatarSvg = useMemo(() => {
    if (avatarData.avatarType === "system") {
      console.log(avatarData.avatarStyle, avatarData.avatarSeed, "系统头像");
      try {
        const styleModule = (
          styles as Record<string, Style<Record<string, unknown>>>
        )[avatarData.avatarStyle];
        if (styleModule) {
          return createAvatar(styleModule, {
            seed: avatarData.avatarSeed,
          }).toString();
        }
      } catch (error) {
        console.error("生成头像失败:", error);
      }
    }
    return null;
  }, [avatarData.avatarType, avatarData.avatarSeed, avatarData.avatarStyle]);

  // 头像展示逻辑
  const renderAvatar = () => {
    // 优先显示自定义头像
    if (avatarData.avatarType === "custom" && avatarData.avatarUrl) {
      return (
        <OssAvatar
          src={avatarData.avatarUrl}
          alt="用户头像"
          size={80}
          className="w-full h-full border-2 border-blue-400"
        />
      );
    }
    
    // 其次显示系统头像
    if (avatarData.avatarType === "system" && systemAvatarSvg) {
      const svgBase64 =
        typeof window === "undefined"
          ? Buffer.from(systemAvatarSvg).toString("base64")
          : window.btoa(unescape(encodeURIComponent(systemAvatarSvg)));
      const dataUri = `data:image/svg+xml;base64,${svgBase64}`;
      return (
        <AvatarImage
          src={dataUri}
          alt="用户头像"
          className="w-full h-full object-cover"
        />
      );
    }
    
    // fallback
    return <AvatarFallback>{profile?.name?.[0] || "U"}</AvatarFallback>;
  };

  return (
    <>
      <div
        className="relative group cursor-pointer"
        onClick={handleAvatarClick}
      >
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
