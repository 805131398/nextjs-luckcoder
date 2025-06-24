"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { useState, useMemo } from "react";
import { createAvatar } from "@dicebear/core";
import * as styles from "@dicebear/collection";
import DiceBearAvatarPanel from "./DiceBearAvatarPanel";
import UploadAvatarPanel from "./UploadAvatarPanel";

export interface AvatarData {
  avatarType: "system" | "custom";
  avatarSeed: string;
  avatarStyle: string;
  avatarUrl?: string;
}

interface AvatarDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: AvatarData) => void;
  initialData: AvatarData;
}

export default function AvatarDialog({ open, onOpenChange, onSave, initialData }: AvatarDialogProps) {
  const [tab, setTab] = useState<"system" | "custom">(initialData.avatarType);
  const [avatarData, setAvatarData] = useState<AvatarData>(initialData);

  // 生成系统头像预览
  const systemAvatarSvg = useMemo(() => {
    console.log("Generating avatar with:", { 
      seed: avatarData.avatarSeed, 
      style: avatarData.avatarStyle 
    });
    
    try {
      const styleModule = (styles as Record<string, unknown>)[avatarData.avatarStyle];
      console.log("Style module found:", !!styleModule, avatarData.avatarStyle);
      
      if (styleModule) {
        const avatar = createAvatar(styleModule as any, { seed: avatarData.avatarSeed });
        const svg = avatar.toString();
        console.log("Generated SVG length:", svg.length);
        console.log("SVG preview:", svg.substring(0, 100) + "...");
        return svg;
      }
    } catch (error) {
      console.error('生成头像失败:', error);
    }
    return null;
  }, [avatarData.avatarSeed, avatarData.avatarStyle]);

  // 根据当前选中的 tab 决定预览内容
  const renderPreview = () => {
    console.log("renderPreview called:", { 
      tab, 
      systemAvatarSvg: !!systemAvatarSvg,
      systemAvatarSvgLength: systemAvatarSvg?.length,
      avatarUrl: avatarData.avatarUrl 
    });
    
    if (tab === "system" && systemAvatarSvg) {
      console.log("Rendering system avatar SVG");
      return <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: systemAvatarSvg }} />;
    } else if (tab === "custom" && avatarData.avatarUrl) {
      console.log("Rendering custom avatar image");
      return <AvatarImage src={avatarData.avatarUrl} alt="头像预览" />;
    } else {
      console.log("Rendering fallback avatar");
      return <AvatarFallback>U</AvatarFallback>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>更换头像</DialogTitle>
        </DialogHeader>
        
        {/* 头像预览区 */}
        <div className="flex justify-center mb-6">
          <Avatar className="w-20 h-20">
            {renderPreview()}
          </Avatar>
        </div>

        {/* 切换按钮 */}
        <div className="flex rounded-lg bg-muted p-1 mb-4">
          <button
            onClick={() => setTab("system")}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all ${
              tab === "system"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            系统头像
          </button>
          <button
            onClick={() => setTab("custom")}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all ${
              tab === "custom"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            上传图片
          </button>
        </div>
        
        {/* 内容区 */}
        <div className="mt-4">
          {tab === "system" && (
            <DiceBearAvatarPanel
              value={avatarData}
              onChange={data => setAvatarData({ ...avatarData, ...data, avatarType: "system" })}
            />
          )}
          
          {tab === "custom" && (
            <UploadAvatarPanel
              value={avatarData}
              onChange={data => setAvatarData({ ...avatarData, ...data, avatarType: "custom" })}
            />
          )}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={() => onSave({ ...avatarData, avatarType: tab })}>
            确认
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 