"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, Cog, Users, Workflow } from "lucide-react";
import PageHeader from "../components/PageHeader";

/**
 * 智能体页面
 * 提供智能体创建和管理功能
 */
export default function AgentPage() {
  return (
    <div className="flex flex-col h-screen">
      {/* 页面头部 */}
      <PageHeader title="智能体工坊" />
      {/* 主要内容区域 */}
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 py-8">
          {/* 页面描述 */}
          <div className="text-center mb-8">
            <p className="text-lg text-gray-600">
              创建专业智能体，定制化您的 AI 助手
            </p>
          </div>

          {/* 功能卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="text-center">
              <CardHeader>
                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Cog className="w-8 h-8 text-orange-600" />
                </div>
                <CardTitle>智能体配置</CardTitle>
                <CardDescription>
                  自定义智能体的角色、能力和行为模式
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
                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Workflow className="w-8 h-8 text-orange-600" />
                </div>
                <CardTitle>工作流设计</CardTitle>
                <CardDescription>
                  设计智能体的工作流程和自动化任务
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
                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-orange-600" />
                </div>
                <CardTitle>团队协作</CardTitle>
                <CardDescription>
                  多人协作管理智能体，共享AI能力
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
              <Bot className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">功能开发中</h3>
              <p className="text-gray-600">
                我们正在努力开发智能体功能，敬请期待！
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 