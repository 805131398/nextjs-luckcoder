"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Play, 
  Clock, 
  Users, 
  Eye,
  Heart,
  Share2,
  MoreVertical,
  Film
} from "lucide-react";
import PageHeader from "../components/PageHeader";

// 短剧数据类型
interface ShortDrama {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  characters: number;
  views: number;
  likes: number;
  createdAt: string;
  status: 'completed' | 'generating' | 'draft';
  genre: string;
  episodes: number;
}

/**
 * AI 短剧生成页面
 * 显示短剧列表和创建新短剧功能
 */
export default function ShortDramaPage() {
  // 假数据
  const [dramas] = useState<ShortDrama[]>([
    {
      id: '1',
      title: '霸道总裁的百日新娘',
      description: '一场意外的契约婚姻，让平凡女孩遇见了冷酷霸道的总裁，从相互厌恶到深深相爱的浪漫故事。',
      thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop',
      duration: '15:30',
      characters: 6,
      views: 12500,
      likes: 890,
      createdAt: '2024-01-15',
      status: 'completed',
      genre: '都市言情',
      episodes: 8
    },
    {
      id: '2', 
      title: '穿越古代当皇妃',
      description: '现代白领意外穿越到古代，凭借现代知识在后宫中步步为营，最终获得皇帝宠爱的传奇故事。',
      thumbnail: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop',
      duration: '18:45',
      characters: 8,
      views: 8900,
      likes: 654,
      createdAt: '2024-01-12',
      status: 'completed',
      genre: '古装穿越',
      episodes: 10
    },
    {
      id: '3',
      title: '校园暗恋那些事',
      description: '青春校园里的纯真暗恋，学霸男神与普通女孩之间跨越时光的甜蜜爱恋故事。',
      thumbnail: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=300&h=200&fit=crop',
      duration: '12:20',
      characters: 4,
      views: 15200,
      likes: 1200,
      createdAt: '2024-01-10',
      status: 'completed',
      genre: '校园青春',
      episodes: 6
    },
    {
      id: '4',
      title: '重生复仇记',
      description: '前世被陷害的女主重生回到十八岁，凭借重生的记忆展开复仇计划的爽文故事。',
      thumbnail: 'https://images.unsplash.com/photo-1494790108755-2616c96515e1?w=300&h=200&fit=crop',
      duration: '20:15',
      characters: 12,
      views: 6700,
      likes: 445,
      createdAt: '2024-01-08',
      status: 'generating',
      genre: '现代重生',
      episodes: 12
    },
    {
      id: '5',
      title: '仙侠修真传',
      description: '平凡少年意外获得仙缘，在修真世界中历经磨难，最终成为一代仙尊的热血故事。',
      thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=200&fit=crop',
      duration: '25:40',
      characters: 15,
      views: 3400,
      likes: 289,
      createdAt: '2024-01-05',
      status: 'draft',
      genre: '仙侠玄幻',
      episodes: 15
    }
  ]);

  // 创建新短剧
  const handleCreateDrama = () => {
    // TODO: 导航到创建页面
    console.log('创建新短剧');
  };

  // 播放短剧
  const handlePlayDrama = (drama: ShortDrama) => {
    // TODO: 导航到播放页面
    console.log('播放短剧:', drama.title);
  };

  // 获取状态徽章
  const getStatusBadge = (status: ShortDrama['status']) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-700">已完成</Badge>;
      case 'generating':
        return <Badge className="bg-blue-100 text-blue-700">生成中</Badge>;
      case 'draft':
        return <Badge className="bg-gray-100 text-gray-700">草稿</Badge>;
      default:
        return null;
    }
  };

  // 格式化数字
  const formatNumber = (num: number) => {
    if (num >= 10000) {
      return `${(num / 10000).toFixed(1)}万`;
    }
    return num.toString();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <PageHeader title="AI 短剧生成" backPath="/user/aigc" />
      
      <div className="flex-1 pb-8">
        <div className="container mx-auto px-4 py-8">
          {/* 页面标题和新建按钮 */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">我的短剧</h1>
              <p className="text-gray-600">AI 智能生成精彩短剧内容</p>
            </div>
            <Button 
              onClick={handleCreateDrama}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              <Plus className="w-5 h-5 mr-2" />
              创建新短剧
            </Button>
          </div>

          {/* 短剧网格列表 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* 新建短剧卡片 */}
            <Card 
              className="cursor-pointer border-dashed border-2 border-gray-300 hover:border-purple-400 transition-colors group"
              onClick={handleCreateDrama}
            >
              <CardContent className="flex flex-col items-center justify-center h-64 text-gray-500 group-hover:text-purple-600 transition-colors">
                <div className="w-16 h-16 rounded-full bg-gray-100 group-hover:bg-purple-100 flex items-center justify-center mb-4 transition-colors">
                  <Plus className="w-8 h-8" />
                </div>
                <h3 className="font-semibold text-lg mb-2">创建新短剧</h3>
                <p className="text-sm text-center">
                  使用 AI 智能生成<br />精彩短剧内容
                </p>
              </CardContent>
            </Card>

            {/* 短剧列表 */}
            {dramas.map((drama) => (
              <Card 
                key={drama.id}
                className="cursor-pointer hover:shadow-lg transition-all duration-300 group"
                onClick={() => handlePlayDrama(drama)}
              >
                <div className="relative">
                  {/* 缩略图 */}
                  <div className="relative h-40 bg-gradient-to-br from-purple-400 to-pink-400 rounded-t-lg overflow-hidden">
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-12 h-12 text-white" />
                    </div>
                    {/* 状态徽章 */}
                    <div className="absolute top-3 left-3">
                      {getStatusBadge(drama.status)}
                    </div>
                    {/* 时长 */}
                    <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {drama.duration}
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    {/* 标题和类型 */}
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-lg leading-tight line-clamp-2 flex-1">
                        {drama.title}
                      </h3>
                      <Button variant="ghost" size="sm" className="ml-2 p-1">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    {/* 类型和集数 */}
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="secondary" className="text-xs">
                        {drama.genre}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {drama.episodes} 集
                      </span>
                    </div>

                    {/* 描述 */}
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {drama.description}
                    </p>

                    {/* 统计信息 */}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {formatNumber(drama.views)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          {formatNumber(drama.likes)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {drama.characters}
                        </span>
                      </div>
                      <span>{drama.createdAt}</span>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>

          {/* 空状态提示（当没有短剧时显示） */}
          {dramas.length === 0 && (
            <div className="text-center py-16">
              <Film className="w-24 h-24 text-gray-300 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                还没有创作任何短剧
              </h3>
              <p className="text-gray-500 mb-8">
                点击"创建新短剧"开始您的 AI 创作之旅
              </p>
              <Button 
                onClick={handleCreateDrama}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              >
                <Plus className="w-5 h-5 mr-2" />
                创建第一个短剧
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}