"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { 
  MessageCircle, 
  Image, 
  Video, 
  BookOpen, 
  Bot,
  Sparkles,
  Zap,
  Brain
} from "lucide-react";

/**
 * AIGC 工具选择页面
 * 提供多种 AI 创作工具的入口选择
 */
export default function AIGCPage() {
  const router = useRouter();

  // AI 工具配置列表
  const aiTools = [
    {
      id: 'chat',
      title: '智能对话',
      description: '与 AI 进行自然语言对话，获得智能回答和建议',
      icon: MessageCircle,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 hover:bg-blue-100',
      borderColor: 'border-blue-200',
      path: '/user/aigc/chat'
    },
    {
      id: 'image',
      title: 'AI 生图',
      description: '通过文字描述生成精美图片，支持多种风格和尺寸',
      icon: Image,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 hover:bg-purple-100',
      borderColor: 'border-purple-200',
      path: '/user/aigc/image'
    },
    {
      id: 'video',
      title: 'AI 视频',
      description: '生成短视频内容，支持文本转视频和图片转视频',
      icon: Video,
      color: 'text-red-600',
      bgColor: 'bg-red-50 hover:bg-red-100',
      borderColor: 'border-red-200',
      path: '/user/aigc/video'
    },
    {
      id: 'knowledge',
      title: '知识库',
      description: '构建专属知识库，实现文档问答和知识管理',
      icon: BookOpen,
      color: 'text-green-600',
      bgColor: 'bg-green-50 hover:bg-green-100',
      borderColor: 'border-green-200',
      path: '/user/aigc/knowledge'
    },
    {
      id: 'agent',
      title: '智能体',
      description: '创建专业智能体，定制化 AI 助手和工作流',
      icon: Bot,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 hover:bg-orange-100',
      borderColor: 'border-orange-200',
      path: '/user/aigc/agent'
    },
    {
      id: 'creative',
      title: '创意工坊',
      description: '文案创作、代码生成、创意设计等多种创作工具',
      icon: Sparkles,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50 hover:bg-pink-100',
      borderColor: 'border-pink-200',
      path: '/user/aigc/creative'
    }
  ];

  /**
   * 处理工具选择，导航到对应页面
   * @param path - 目标页面路径
   */
  const handleToolSelect = (path: string) => {
    router.push(path);
  };

  return (
    <div className="container mx-auto hx-auto px-4 py-8">
      {/* 页面标题和描述 */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-4">
          <Brain className="w-8 h-8 text-blue-600 mr-3" />
          <h1 className="text-4xl font-bold text-gray-900">AI 创作工坊</h1>
        </div>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          探索强大的 AI 创作工具，释放无限创意潜能
        </p>
      </div>

      {/* 工具网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {aiTools.map((tool) => {
          const IconComponent = tool.icon;
          return (
            <Card 
              key={tool.id}
              className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 ${tool.bgColor} ${tool.borderColor} border-2`}
              onClick={() => handleToolSelect(tool.path)}
            >
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className={`p-4 rounded-full bg-white shadow-md`}>
                    <IconComponent className={`w-8 h-8 ${tool.color}`} />
                  </div>
                </div>
                <CardTitle className={`text-xl font-semibold ${tool.color}`}>
                  {tool.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-gray-600 mb-6 leading-relaxed">
                  {tool.description}
                </CardDescription>
                <Button 
                  variant="outline" 
                  className={`w-full ${tool.color} border-current hover:bg-current hover:text-white transition-colors`}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  开始使用
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* 底部提示 */}
      <div className="text-center mt-12">
        <p className="text-gray-500">
          选择任意工具开始您的 AI 创作之旅
        </p>
      </div>
    </div>
  );
}