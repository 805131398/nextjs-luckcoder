"use client";
import { useState } from "react";
import { Button } from "../ui/button";
import { AvatarData } from "./AvatarDialog";

const styleOptions = [
  { label: "Lorelei", value: "lorelei" },
  { label: "Adventurer", value: "adventurer" },
  { label: "Avataaars", value: "avataaars" },
  { label: "Bottts", value: "bottts" },
  { label: "Big Smile", value: "bigSmile" },
  { label: "Croodles", value: "croodles" },
  { label: "Fun Emoji", value: "funEmoji" },
  { label: "Miniavs", value: "miniavs" },
  { label: "Notionists", value: "notionists" },
  { label: "Open Peeps", value: "openPeeps" },
  { label: "Personas", value: "personas" },
  { label: "Pixel Art", value: "pixelArt" },
];

interface DiceBearAvatarPanelProps {
  value: AvatarData;
  onChange: (data: Partial<AvatarData>) => void;
}

export default function DiceBearAvatarPanel({ value, onChange }: DiceBearAvatarPanelProps) {
  const [seed, setSeed] = useState(value.avatarSeed || "user");
  const [style, setStyle] = useState(value.avatarStyle || "lorelei");

  const handleStyleChange = (newStyle: string) => {
    console.log("Style changed to:", newStyle);
    setStyle(newStyle);
    onChange({ avatarSeed: seed, avatarStyle: newStyle });
  };

  const handleRandomSeed = () => {
    const newSeed = Math.random().toString(36).slice(2, 10);
    console.log("Random seed generated:", newSeed);
    setSeed(newSeed);
    onChange({ avatarSeed: newSeed, avatarStyle: style });
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* 风格选择 */}
      <div className="w-full">
        <label className="block text-sm font-medium mb-2">选择风格</label>
        <select
          value={style}
          onChange={(e) => handleStyleChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {styleOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* 随机按钮 */}
      <Button
        variant="outline"
        onClick={handleRandomSeed}
        className="w-full"
      >
        🎲 随机生成
      </Button>

      {/* 调试信息 */}
      <div className="text-xs text-gray-500 text-center">
        当前: {style} / {seed}
      </div>
    </div>
  );
} 