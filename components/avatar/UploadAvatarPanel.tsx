"use client";
import { useRef, useState } from "react";
import Cropper from "react-easy-crop";
import { Button } from "../ui/button";
import { Upload, RotateCcw, RotateCw } from "lucide-react";
import { AvatarData } from "./AvatarDialog";

interface UploadAvatarPanelProps {
  value: AvatarData;
  onChange: (data: Partial<AvatarData>) => void;
}

export default function UploadAvatarPanel({ value, onChange }: UploadAvatarPanelProps) {
  const [image, setImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 处理图片选择
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 检查文件类型
      if (!file.type.startsWith('image/')) {
        alert('请选择图片文件');
        return;
      }
      
      // 检查文件大小 (限制为5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('图片大小不能超过5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
        setRotation(0); // 重置旋转角度
      };
      reader.readAsDataURL(file);
    }
  };

  // 裁剪完成回调
  const handleCropComplete = async (croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
    if (image) {
      try {
        const croppedImage = await getCroppedImg(image, croppedAreaPixels, rotation);
        onChange({ avatarUrl: croppedImage });
      } catch (error) {
        console.error('裁剪图片失败:', error);
      }
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      {/* 文件选择 */}
      <div className="w-full">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <Button
          variant="outline"
          onClick={() => inputRef.current?.click()}
          className="w-full"
        >
          <Upload className="w-4 h-4 mr-2" />
          选择图片
        </Button>
        <p className="text-xs text-gray-500 mt-2 text-center">
          支持 JPG、PNG、GIF 格式，大小不超过 5MB
        </p>
      </div>

      {/* 裁剪区域 */}
      {image && (
        <div className="w-full">
          <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              rotation={rotation}
              aspect={1}
              cropShape="round"
              showGrid={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onRotationChange={setRotation}
              onCropComplete={handleCropComplete}
            />
          </div>
          
          {/* 操作按钮 */}
          <div className="flex gap-2 mt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRotation(r => r - 90)}
              className="flex-1"
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              左旋转
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRotation(r => r + 90)}
              className="flex-1"
            >
              <RotateCw className="w-4 h-4 mr-1" />
              右旋转
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// 工具函数：裁剪图片
async function getCroppedImg(imageSrc: string, crop: any, rotation = 0): Promise<string> {
  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const img = new window.Image();
      img.crossOrigin = "anonymous";
      img.src = url;
      img.onload = () => resolve(img);
      img.onerror = reject;
    });

  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  
  if (!ctx) throw new Error("No 2d context");

  const maxSize = Math.max(image.width, image.height);
  const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

  canvas.width = safeArea;
  canvas.height = safeArea;

  ctx.translate(safeArea / 2, safeArea / 2);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.translate(-safeArea / 2, -safeArea / 2);

  ctx.drawImage(
    image,
    safeArea / 2 - image.width * 0.5,
    safeArea / 2 - image.height * 0.5
  );

  const data = ctx.getImageData(0, 0, safeArea, safeArea);

  canvas.width = crop.width;
  canvas.height = crop.height;

  ctx.putImageData(
    data,
    Math.round(0 - safeArea / 2 + image.width * 0.5 - crop.x),
    Math.round(0 - safeArea / 2 + image.height * 0.5 - crop.y)
  );

  return canvas.toDataURL("image/jpeg");
} 