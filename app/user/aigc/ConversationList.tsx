"use client";

import { useEffect, useState, useImperativeHandle, forwardRef } from "react";
import { useSession } from "next-auth/react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface Conversation {
  id: string;
  name: string;
  created_at: number;
}

interface ConversationListProps {
  onConversationSelect: (id: string) => void;
  onNewConversation: () => void;
  currentConversationId?: string;
}

export interface ConversationListHandle {
  refresh: () => void;
}

export const ConversationList = forwardRef<ConversationListHandle, ConversationListProps>(
  function ConversationList({ onConversationSelect, onNewConversation, currentConversationId }, ref) {
    const { data: session } = useSession();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchConversations = () => {
      if (session?.user?.id) {
        setLoading(true);
        fetch(`http://172.16.95.3/v1/conversations?user=${session.user.id}&limit=20`, {
          headers: { "Authorization": "Bearer app-i5CRTpmqBAJhB7a9jlmncrDM" }
        })
        .then(res => res.json())
        .then(data => {
          if (data.data) {
            setConversations(data.data);
            if (data.data.length > 0 && !currentConversationId) {
              onConversationSelect(data.data[0].id);
            }
          }
        })
        .finally(() => setLoading(false));
      }
    };

    useImperativeHandle(ref, () => ({
      refresh: fetchConversations,
    }));
    
    useEffect(() => {
      fetchConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session]);

    return (
      <div className="w-full h-full p-2 border-r">
        <div className="flex items-center justify-between p-2">
          <h2 className="text-lg font-semibold">历史会话</h2>
          <Button variant="ghost" size="icon" onClick={onNewConversation} aria-label="新建会话">
            <PlusIcon className="w-5 h-5" />
          </Button>
        </div>
        {loading && <Progress value={100} className="w-full h-1 animate-pulse" />}
        <ScrollArea className="h-[calc(100vh-150px)]">
          {conversations.length === 0 && !loading ? (
            <div className="p-4 text-center text-muted-foreground">
              <p className="mb-2">没有历史会话</p>
              <Button onClick={onNewConversation}>开始新对话</Button>
            </div>
          ) : (
            <div className="space-y-1">
              {conversations.map(conv => (
                <Button
                  key={conv.id}
                  variant={currentConversationId === conv.id ? "secondary" : "ghost"}
                  className="w-full justify-start text-left h-auto"
                  onClick={() => onConversationSelect(conv.id)}
                >
                  <div className="flex-1 truncate">
                    <p className="font-medium">{conv.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(conv.created_at * 1000).toLocaleString()}
                    </p>
                  </div>
                </Button>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    );
  }
); 