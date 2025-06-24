"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Palette, Settings, Sparkles, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from 'next/image';

/**
 * AI 生图页面
 * 提供文本到图片的生成功能
 */
export default function ImagePage() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  /**
   * 处理图片生成
   */
  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    // TODO: 实现图片生成逻辑
    setTimeout(() => {
      setIsGenerating(false);
    }, 3000);
  };

  /**
   * 返回工具选择页面
   */
  const handleGoBack = () => {
    router.push('/user/aigc');
  };

  return (
    <div className="flex flex-col h-screen">
      {/* 顶部导航栏 */}
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleGoBack}
            className="mr-3"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回工具选择
          </Button>
          <h1 className="text-lg font-semibold text-gray-900">AI 生图工坊</h1>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 py-8">
      {/* 页面描述 */}
      <div className="text-center mb-8">
        <p className="text-lg text-gray-600">
          通过文字描述生成精美图片，释放您的创意想象
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* 左侧控制面板 */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="w-5 h-5 mr-2 text-purple-600" />
                创作设置
              </CardTitle>
              <CardDescription>
                输入您的创意描述，AI 将为您生成独特的图片
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="prompt">图片描述</Label>
                <Input
                  id="prompt"
                  placeholder="描述您想要生成的图片，例如：一只可爱的小猫在花园里玩耍..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="mt-2"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>图片尺寸</Label>
                  <select className="w-full mt-2 p-2 border rounded-md">
                    <option>1024x1024 (正方形)</option>
                    <option>1024x768 (横版)</option>
                    <option>768x1024 (竖版)</option>
                  </select>
                </div>
                <div>
                  <Label>艺术风格</Label>
                  <select className="w-full mt-2 p-2 border rounded-md">
                    <option>写实风格</option>
                    <option>卡通风格</option>
                    <option>油画风格</option>
                    <option>水彩风格</option>
                  </select>
                </div>
              </div>

              <Button 
                onClick={handleGenerate}
                disabled={!prompt.trim() || isGenerating}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {isGenerating ? (
                  <>
                    <Settings className="w-4 h-4 mr-2 animate-spin" />
                    生成中...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    生成图片
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* 右侧预览区域 */}
        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>生成预览</CardTitle>
              <CardDescription>
                您的创作将在这里显示
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-96">
              <div className="text-center text-gray-400">
                <Image src="/placeholder.png" alt="占位图标" width={64} height={64} className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>输入描述并点击生成按钮</p>
                <p className="text-sm mt-2">AI 将为您创作独特的图片</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 功能说明 */}
      <div className="mt-12 text-center">
        <h3 className="text-xl font-semibold mb-4">功能特色</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="font-medium mb-2">智能理解</h4>
            <p className="text-sm text-gray-600">AI 深度理解您的文字描述，生成符合预期的图片</p>
          </div>
          <div className="text-center">
            <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <Palette className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="font-medium mb-2">多样风格</h4>
            <p className="text-sm text-gray-600">支持多种艺术风格，满足不同创作需求</p>
          </div>
          <div className="text-center">
            <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <Settings className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="font-medium mb-2">精细控制</h4>
            <p className="text-sm text-gray-600">可调节尺寸、风格等参数，精确控制生成效果</p>
          </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}