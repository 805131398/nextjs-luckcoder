"use client";
import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import Image from "next/image";

function genId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return Math.random().toString(36).slice(2) + Date.now();
}

interface Message {
  role: "user" | "ai";
  content: string;
  imageUrl?: string;
  messageId?: string;
}

interface HistoryItem {
  id: string;
  query: string;
  answer: string;
  message_files?: { url: string }[];
}

interface AIGCChatProps {
  conversationId?: string;
  onConversationUpdated?: () => void;
}

export default function AIGCChat({ conversationId, onConversationUpdated }: AIGCChatProps) {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const parentMessageIdRef = useRef<string>(genId());

  useEffect(() => {
    if (conversationId && session?.user?.id) {
      const userId = session.user.id;
      fetch(`http://172.16.95.3/v1/messages?user=${userId}&conversation_id=${conversationId}`, {
        headers: {
          "Authorization": "Bearer app-i5CRTpmqBAJhB7a9jlmncrDM"
        }
      })
        .then(res => res.json())
        .then(res => {
          if (Array.isArray(res.data)) {
            const historyMsgs = res.data.flatMap((item: HistoryItem) => {
              const imageUrl = item.message_files?.[0]?.url 
                ? `http://172.16.95.3${item.message_files[0].url}` 
                : undefined;

              return [
                { role: "user" as const, content: item.query, messageId: item.id },
                { role: "ai" as const, content: item.answer, messageId: item.id, imageUrl }
              ];
            });
            setMessages(historyMsgs);
          }
        });
    } else {
      setMessages([]);
    }
  }, [session, conversationId]);

  const handleSend = async () => {
    if (!input.trim()) return;  
    const userId = session?.user?.id;
    const userMsg: Message = { role: "user", content: input, messageId: parentMessageIdRef.current };
    setMessages((msgs) => [...msgs, userMsg]);
    setInput("");
    setLoading(true);

    setMessages(msgs => [...msgs, { role: "ai", content: "", messageId: undefined }]);

    try {
      const response = await fetch("http://172.16.95.3/v1/chat-messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer app-i5CRTpmqBAJhB7a9jlmncrDM"
        },
        body: JSON.stringify({
          "inputs": {},
          "query": input,
          "response_mode": "streaming",
          "conversation_id": conversationId,
          "user": userId
        }),
      });

      if (!response.body) throw new Error("无响应体");
      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let done = false;
      let aiContent = "";
      let aiImageUrl = "";
      let aiMessageId: string | undefined = undefined;
      let finalConversationId: string | undefined = undefined;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          chunk.split('\n').forEach(line => {
            if (line.startsWith('data: ')) {
              const dataStr = line.replace('data: ', '').trim();
              if (dataStr && dataStr !== '[DONE]') {
                try {
                  const data = JSON.parse(dataStr);
                  console.log(data,"data");
                  if (data.event === "message_end") {
                    finalConversationId = data.conversation_id;
                    aiMessageId = data.message_id;
                    return;
                  }
                  if (data.answer) {
                    aiContent += data.answer;
                  }
                  if (data.image_url || data.imageUrl) {
                    aiImageUrl = data.image_url || data.imageUrl;
                  }
                  if (data.message_id) {
                    aiMessageId = data.message_id;
                  }
                  setMessages(msgs => {
                    const lastIdx = msgs.length - 1;
                    if (lastIdx >= 0 && msgs[lastIdx].role === 'ai') {
                      const updated = { ...msgs[lastIdx], content: aiContent, imageUrl: aiImageUrl, messageId: aiMessageId };
                      return [...msgs.slice(0, lastIdx), updated];
                    }
                    return msgs;
                  });
                } catch {}
              }
            }
          });
        }
      }
      console.log("AI回复内容：", aiContent, "图片URL：", aiImageUrl);
      
      if (finalConversationId && aiMessageId) {
        await fetchMessageDetails(finalConversationId, aiMessageId);
      }
      
      if (aiMessageId) {
        parentMessageIdRef.current = aiMessageId;
      }

      if (!conversationId && onConversationUpdated) {
        onConversationUpdated();
      }

    } catch (error) {
      console.error("生成图片失败:", error);
      toast.error("生成失败，请重试");
      setMessages(msgs => {
        const lastIdx = msgs.length - 1;
        if (lastIdx >= 0 && msgs[lastIdx].role === 'ai') {
          return [...msgs.slice(0, lastIdx), { ...msgs[lastIdx], content: "生成失败，请稍后重试" }];
        }
        return msgs;
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMessageDetails = async (conversationId: string, messageId: string) => {
    try {
      const res = await fetch(`http://172.16.95.3/v1/messages?user=${session?.user?.id}&conversation_id=${conversationId}&message_id=${messageId}`, {
        headers: {
          "Authorization": "Bearer app-i5CRTpmqBAJhB7a9jlmncrDM"
        }
      });
      const result = await res.json();
      if (result.data && result.data.length > 0) {
        const message = result.data[0];
        const imageUrl = message.message_files?.[0]?.url
          ? `http://172.16.95.3${message.message_files[0].url}`
          : undefined;

        setMessages(msgs => {
          const lastIdx = msgs.length - 1;
          if (lastIdx >= 0 && msgs[lastIdx].role === 'ai') {
            const updated = { ...msgs[lastIdx], content: message.answer, imageUrl };
            return [...msgs.slice(0, lastIdx), updated];
          }
          return msgs;
        });
      }
    } catch (error) {
      console.error("获取消息详情失败:", error);
      toast.error("获取消息详情失败");
    }
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col w-full max-w-full">
      {/* 消息内容区域，自动撑满 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`rounded-lg px-4 py-2 max-w-[80%] text-sm shadow ${msg.role === "user" ? "bg-primary text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"}`}>
              {msg.content}
              {msg.imageUrl && (
                <Image 
                  src={msg.imageUrl} 
                  alt="AI生成" 
                  fill
                  className="mt-2 rounded-lg border w-full max-w-[512px] object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder.png";
                    toast.error("图片加载失败");
                  }}
                />
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="rounded-lg px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 max-w-[80%] text-sm shadow animate-pulse">
              AI 正在生成图片...
            </div>
          </div>
        )}
      </div>
      {/* 输入框区域，固定底部 */}
      <div className="flex gap-2 p-4 border-t bg-white dark:bg-gray-900 shrink-0">
        <Input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="请输入你的描述，如：一只宇航员猫在月球上..."
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
          disabled={loading}
        />
        <Button 
          onClick={handleSend} 
          disabled={loading || !input.trim()}
        >
          生成
        </Button>
      </div>
    </div>
  );
} 