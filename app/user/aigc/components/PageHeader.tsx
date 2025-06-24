"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface PageHeaderProps {
  title: string;
  backPath?: string;
}

/**
 * 通用页面头部组件
 * 包含返回按钮和页面标题
 */
export default function PageHeader({ title, backPath = '/user/aigc' }: PageHeaderProps) {
  const router = useRouter();

  /**
   * 处理返回操作
   */
  const handleGoBack = () => {
    router.push(backPath);
  };

  return (
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
        <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
      </div>
    </div>
  );
} 