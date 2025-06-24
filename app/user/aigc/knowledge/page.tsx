"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Database, Search, Brain } from "lucide-react";
import PageHeader from "../components/PageHeader";

/**
 * 知识库页面
 * 提供知识库管理和问答功能
 */
export default function KnowledgePage() {
  return (
    <div className="flex flex-col h-screen">
      {/* 页面头部 */}
      <PageHeader title="智能知识库" />
      
      {/* 主要内容区域 */}
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 py-8">
          {/* 页面描述 */}
          <div className="text-center mb-8">
            <p className="text-lg text-gray-600">
              构建专属知识库，让 AI 成为您的专业助手
            </p>
          </div>

      {/* 功能卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        <Card className="text-center">
          <CardHeader>
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Database className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle>文档管理</CardTitle>
            <CardDescription>
              上传和管理各类文档，构建专业知识库
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
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle>智能问答</CardTitle>
            <CardDescription>
              基于知识库内容进行精准问答
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
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle>知识图谱</CardTitle>
            <CardDescription>
              可视化知识关系，深度理解内容
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
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">功能开发中</h3>
          <p className="text-gray-600">
            我们正在努力开发智能知识库功能，敬请期待！
          </p>
        </div>
      </div>
    </div>
    </div>
    </div>

  );
}