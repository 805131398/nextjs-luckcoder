"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { 
  Film,
  Sparkles,
  Brain,
  Video,
  Image,
  Mic,
  BookOpen,
  Zap
} from "lucide-react";

/**
 * AIGC 功能菜单页面
 * 提供多种 AI 创作工具的入口选择
 */
export default function AIGCPage() {
  const router = useRouter();

  // AIGC 功能列表
  const aiFeatures = [
    {
      id: 'short-drama',
      title: 'AI 短剧生成',
      description: '智能创作短剧脚本，一键生成精彩故事情节和对话',
      icon: Film,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 hover:bg-purple-100',
      borderColor: 'border-purple-200',
      path: '/user/aigc/short-drama',
      status: '热门'
    },
    {
      id: 'video-generation',
      title: 'AI 视频生成',
      description: '文本转视频，图片转视频，智能生成专业视频内容',
      icon: Video,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 hover:bg-blue-100',
      borderColor: 'border-blue-200',
      path: '/user/aigc/video',
      status: '即将上线'
    },
    {
      id: 'image-generation',
      title: 'AI 图像生成',
      description: '根据文字描述生成高质量图片，支持多种艺术风格',
      icon: Image,
      color: 'text-green-600',
      bgColor: 'bg-green-50 hover:bg-green-100',
      borderColor: 'border-green-200',
      path: '/user/aigc/image',
      status: '即将上线'
    },
    {
      id: 'voice-generation',
      title: 'AI 语音合成',
      description: '文字转语音，多种音色选择，自然流畅的语音输出',
      icon: Mic,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 hover:bg-orange-100',
      borderColor: 'border-orange-200',
      path: '/user/aigc/voice',
      status: '即将上线'
    },
    {
      id: 'knowledge-base',
      title: 'AI 知识库',
      description: '构建专属知识库，智能问答和文档理解',
      icon: BookOpen,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50 hover:bg-teal-100',
      borderColor: 'border-teal-200',
      path: '/user/aigc/knowledge',
      status: '即将上线'
    },
    {
      id: 'creative-writing',
      title: 'AI 创意写作',
      description: '智能文案创作，小说续写，创意故事生成',
      icon: Sparkles,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50 hover:bg-pink-100',
      borderColor: 'border-pink-200',
      path: '/user/aigc/writing',
      status: '即将上线'
    }
  ];

  /**
   * 处理功能选择，导航到对应页面
   */
  const handleFeatureSelect = (feature: typeof aiFeatures[0]) => {
    if (feature.status === '即将上线') {
      // TODO: 显示即将上线提示
      console.log('功能即将上线');
      return;
    }
    router.push(feature.path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-12">
        {/* 页面标题和描述 */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-lg">
              <Brain className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            AI 创作中心
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            探索强大的 AI 创作工具，释放无限创意潜能，让每个人都能成为内容创作者
          </p>
        </div>

        {/* 功能网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {aiFeatures.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <Card 
                key={feature.id}
                className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 ${feature.bgColor} ${feature.borderColor} border-2 relative overflow-hidden`}
                onClick={() => handleFeatureSelect(feature)}
              >
                {/* 状态标签 */}
                {feature.status && (
                  <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${
                    feature.status === '热门' 
                      ? 'bg-red-100 text-red-600' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {feature.status}
                  </div>
                )}

                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <div className={`p-4 rounded-full bg-white shadow-md`}>
                      <IconComponent className={`w-8 h-8 ${feature.color}`} />
                    </div>
                  </div>
                  <CardTitle className={`text-xl font-semibold ${feature.color}`}>
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-gray-600 mb-6 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                  <Button 
                    variant="outline" 
                    className={`w-full ${feature.color} border-current hover:bg-current hover:text-white transition-colors`}
                    disabled={feature.status === '即将上线'}
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    {feature.status === '即将上线' ? '敬请期待' : '开始使用'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* 底部提示 */}
        <div className="text-center mt-16">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto shadow-lg">
            <Sparkles className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">开启 AI 创作之旅</h3>
            <p className="text-gray-600 mb-6">
              选择任意功能开始体验强大的 AI 创作能力，让想象力成为现实
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
              <span>🎬 专业级输出</span>
              <span>⚡ 秒级生成</span>
              <span>🎨 无限创意</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}