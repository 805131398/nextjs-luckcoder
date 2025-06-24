"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import AIGCChat from "../AIGCChat";
import { ConversationList, ConversationListHandle } from "../ConversationList";

/**
 * 智能对话页面
 * 提供 AI 聊天对话功能，支持多轮对话和对话历史管理
 */
export default function ChatPage() {
  const router = useRouter();
  // 当前对话 ID 状态
  const [currentConversationId, setCurrentConversationId] = useState<string | undefined>();
  // 对话列表组件引用，用于刷新对话列表
  const conversationListRef = useRef<ConversationListHandle>(null);

  /**
   * 处理新建对话
   * 清空当前对话 ID，开始新的对话
   */
  const handleNewConversation = () => {
    setCurrentConversationId(undefined); 
  };

  /**
   * 处理对话更新
   * 当对话内容发生变化时，刷新对话列表
   */
  const handleConversationUpdated = () => {
    conversationListRef.current?.refresh();
  };

  /**
   * 返回工具选择页面
   */
  const handleGoBack = () => {
    router.push('/user/aigc');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
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
          <h1 className="text-lg font-semibold text-gray-900">智能对话</h1>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* 左侧对话列表区域 */}
        <div className="w-1/4 min-w-[250px] max-w-[350px]">
          <ConversationList 
            ref={conversationListRef}
            onConversationSelect={setCurrentConversationId}
            onNewConversation={handleNewConversation}
            currentConversationId={currentConversationId}
          />
        </div>
        
        {/* 右侧聊天区域，确保输入框始终可见 */}
        <div className="flex flex-col h-full min-h-0 flex-1">
          <AIGCChat 
            key={currentConversationId || 'new'} 
            conversationId={currentConversationId}
            onConversationUpdated={handleConversationUpdated}
          />
        </div>
      </div>
    </div>
  );
} 