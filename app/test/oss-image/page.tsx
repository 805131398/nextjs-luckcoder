"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OssImage, OssAvatar, OssImageGrid } from "@/components/ui/oss-image";
import { useOssImage } from "@/lib/hooks/useOssImage";

export default function OssImageTestPage() {
  const [testUrls] = useState([
    // OSS 图片（需要签名 URL）
    "https://luckcoder.oss-cn-beijing.aliyuncs.com/uploads/avatars/1703123456789_abc123.jpg",
    // 普通图片（不需要签名 URL）
    "https://via.placeholder.com/300x200/FF6B6B/FFFFFF?text=普通图片",
    // 另一个 OSS 图片
    "https://luckcoder.oss-cn-beijing.aliyuncs.com/uploads/test/test.txt",
    // 空值测试
    null,
  ]);

  const [singleUrl, setSingleUrl] = useState<string | null>(
    "https://luckcoder.oss-cn-beijing.aliyuncs.com/uploads/avatars/1703123456789_abc123.jpg"
  );

  const { imageUrl, isLoading, error, isOssImage } = useOssImage(singleUrl);

  return (
    <div className="container mx-auto py-8 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>OSS 图片组件测试</CardTitle>
          <CardDescription>
            测试智能 OSS 图片组件，自动判断是否为 OSS 图片并使用签名 URL
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 单个图片测试 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">单个图片测试</h3>
            <div className="flex gap-4 items-center">
              <OssImage
                src={singleUrl}
                alt="测试图片"
                width={200}
                height={150}
                className="rounded-lg border"
              />
              <div className="space-y-2">
                <p><strong>原始 URL:</strong> {singleUrl}</p>
                <p><strong>处理后的 URL:</strong> {imageUrl}</p>
                <p><strong>是否为 OSS 图片:</strong> {isOssImage ? "是" : "否"}</p>
                <p><strong>加载状态:</strong> {isLoading ? "加载中..." : "已完成"}</p>
                {error && <p><strong>错误:</strong> {error}</p>}
              </div>
            </div>
          </div>

          {/* 头像测试 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">头像测试</h3>
            <div className="flex gap-4 items-center">
              <OssAvatar
                src={singleUrl}
                alt="用户头像"
                size={80}
                className="border-2 border-blue-400"
              />
              <OssAvatar
                src="https://via.placeholder.com/80x80/4ECDC4/FFFFFF?text=普通头像"
                alt="普通头像"
                size={80}
                className="border-2 border-green-400"
              />
              <OssAvatar
                src={null}
                alt="空头像"
                size={80}
                className="border-2 border-gray-400"
              />
            </div>
          </div>

          {/* 批量图片测试 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">批量图片测试</h3>
            <OssImageGrid
              images={testUrls}
              alt="批量测试图片"
              gridClassName="grid grid-cols-2 md:grid-cols-4 gap-4"
              imageClassName="w-full h-32 object-cover rounded-lg border"
            />
          </div>

          {/* URL 切换测试 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">URL 切换测试</h3>
            <div className="flex gap-2 mb-4">
              <Button
                onClick={() => setSingleUrl("https://luckcoder.oss-cn-beijing.aliyuncs.com/uploads/avatars/1703123456789_abc123.jpg")}
                variant="outline"
              >
                OSS 图片
              </Button>
              <Button
                onClick={() => setSingleUrl("https://via.placeholder.com/300x200/FF6B6B/FFFFFF?text=普通图片")}
                variant="outline"
              >
                普通图片
              </Button>
              <Button
                onClick={() => setSingleUrl(null)}
                variant="outline"
              >
                空图片
              </Button>
            </div>
            <OssImage
              src={singleUrl}
              alt="切换测试"
              width={300}
              height={200}
              className="rounded-lg border"
              fallbackSrc="https://via.placeholder.com/300x200/CCCCCC/666666?text=无图片"
            />
          </div>

          {/* 调试信息 */}
          <div className="p-4 bg-gray-100 rounded-lg">
            <h4 className="font-semibold mb-2">调试信息</h4>
            <div className="text-sm space-y-1">
              <p><strong>当前 URL:</strong> {singleUrl || "null"}</p>
              <p><strong>是否为 OSS:</strong> {isOssImage ? "是" : "否"}</p>
              <p><strong>加载状态:</strong> {isLoading ? "加载中" : "已完成"}</p>
              <p><strong>处理后的 URL:</strong> {imageUrl || "null"}</p>
              <p><strong>是否为 HTTPS:</strong> {imageUrl ? (imageUrl.startsWith('https:') ? "是" : "否") : "N/A"}</p>
              <p><strong>是否为签名 URL:</strong> {imageUrl ? (imageUrl.includes('?') ? "是" : "否") : "N/A"}</p>
              {error && <p><strong>错误信息:</strong> {error}</p>}
            </div>
          </div>

          {/* URL 类型说明 */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">URL 类型说明</h4>
            <div className="text-sm text-blue-800 space-y-1">
              <p>• <strong>原始 OSS URL:</strong> 存储在数据库中的永久 URL</p>
              <p>• <strong>签名 URL:</strong> 动态生成的临时访问 URL（带 ? 参数）</p>
              <p>• <strong>缓存机制:</strong> 签名 URL 自动缓存，过期前 5 分钟重新获取</p>
              <p>• <strong>安全访问:</strong> 私有存储桶通过签名 URL 访问，公共存储桶直接访问</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 