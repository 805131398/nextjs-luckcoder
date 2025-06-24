"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, Upload, Play, Settings } from "lucide-react";
import PageHeader from "../components/PageHeader";

/**
 * AI 视频页面
 * 提供 AI 视频生成和编辑功能
 */
export default function VideoPage() {
  return (
    <div className="flex flex-col h-screen">
      {/* 页面头部 */}
      <PageHeader title="AI 视频工坊" />
      
      {/* 主要内容区域 */}
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 py-8">
          {/* 页面描述 */}
          <div className="text-center mb-8">
            <p className="text-lg text-gray-600">
              AI 驱动的视频创作平台，让创意动起来
            </p>
          </div>

      {/* 功能卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        <Card className="text-center">
          <CardHeader>
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Play className="w-8 h-8 text-red-600" />
            </div>
            <CardTitle>文本转视频</CardTitle>
            <CardDescription>
              输入文字描述，AI 自动生成对应的视频内容
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" disabled>
              即将上线
            </Button>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-red-600" />
            </div>
            <CardTitle>图片转视频</CardTitle>
            <CardDescription>
              上传图片，AI 将其转换为动态视频
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" disabled>
              即将上线
            </Button>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Settings className="w-8 h-8 text-red-600" />
            </div>
            <CardTitle>视频编辑</CardTitle>
            <CardDescription>
              AI 辅助的视频剪辑和特效处理
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" disabled>
              即将上线
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* 敬请期待 */}
      <div className="text-center mt-12">
        <div className="bg-gray-50 rounded-lg p-8 max-w-2xl mx-auto">
          <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">功能开发中</h3>
          <p className="text-gray-600">
            我们正在努力开发 AI 视频功能，敬请期待！
          </p>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
} 