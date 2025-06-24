"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, FileText, Code, Palette, Lightbulb, Zap } from "lucide-react";
import PageHeader from "../components/PageHeader";

/**
 * 创意工坊页面
 * 提供多种 AI 创作工具
 */
export default function CreativePage() {
  return (
    <div className="flex flex-col h-screen">
      {/* 页面头部 */}
      <PageHeader title="创意工坊" />
      {/* 主要内容区域 */}
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 py-8">
          {/* 页面描述 */}
          <div className="text-center mb-8">
            <p className="text-lg text-gray-600">
              释放 AI 创作潜能，让灵感变为现实
            </p>
          </div>

          {/* 功能卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="text-center">
              <CardHeader>
                <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-pink-600" />
                </div>
                <CardTitle>文案创作</CardTitle>
                <CardDescription>
                  AI 驱动的文案创作，包括广告文案、产品描述等
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
                <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Code className="w-8 h-8 text-pink-600" />
                </div>
                <CardTitle>代码生成</CardTitle>
                <CardDescription>
                  智能代码生成和优化，支持多种编程语言
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
                <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Palette className="w-8 h-8 text-pink-600" />
                </div>
                <CardTitle>创意设计</CardTitle>
                <CardDescription>
                  AI 辅助的创意设计和灵感生成
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
                <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lightbulb className="w-8 h-8 text-pink-600" />
                </div>
                <CardTitle>创意策划</CardTitle>
                <CardDescription>
                  项目策划和创意方案生成
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
                <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-pink-600" />
                </div>
                <CardTitle>快速原型</CardTitle>
                <CardDescription>
                  快速生成产品原型和设计方案
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
                <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-pink-600" />
                </div>
                <CardTitle>灵感助手</CardTitle>
                <CardDescription>
                  AI 灵感生成器，激发无限创意
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
              <Sparkles className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">功能开发中</h3>
              <p className="text-gray-600">
                我们正在努力开发创意工坊功能，敬请期待！
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 