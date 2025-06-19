"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [nickname, setNickname] = useState(session?.user?.name || "");
  const [editing, setEditing] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [provider, setProvider] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      const res = await fetch("/api/profile");
      if (res.ok) {
        const data = await res.json();
        setProvider(data.provider);
      }
    }
    fetchProfile();
  }, []);

  if (!session) {
    return <div className="p-8 text-center">请先登录</div>;
  }

  const handleSave = async () => {
    const res = await fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nickname }),
    });
    if (res.ok) {
      if (typeof update === "function") {
        await update();
      }
      setEditing(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    setDialogOpen(false);
    try {
      const res = await fetch("/api/profile/sync", { method: "POST" });
      if (res.ok && typeof update === "function") {
        await update();
        toast.success("同步成功，已从 GitHub 拉取最新信息。");
      } else {
        toast.error("同步失败，请重试或检查网络。");
      }
    } catch {
      toast.error("同步失败，请检查网络。");
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-2 py-4 sm:px-4 md:px-8">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mb-8">
        <Avatar className="w-16 h-16 sm:w-20 sm:h-20 mb-2 sm:mb-0">
          <AvatarImage src={session.user?.image || undefined} alt={session.user?.name || "用户"} />
          <AvatarFallback>{session.user?.name?.[0] || "U"}</AvatarFallback>
        </Avatar>
        <div className="flex-1 w-full">
          <div className="flex items-center gap-2">

            <div className="text-lg sm:text-2xl font-bold mb-2 break-all">
              <Badge>
                {provider === "github" && "GitHub"}
                {provider === "google" && "Google"}
                {provider === "email" && "邮箱"}
                {!provider && "未知"}
              </Badge>
            </div>
            <div className="text-lg sm:text-2xl font-bold mb-2 break-all">{session.user?.email}</div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="p-1"
                  aria-label="同步 GitHub 信息"
                  disabled={syncing}
                >
                  {syncing ? (
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-3.219-6.825M21 4v5h-5" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-3.219-6.825M21 4v5h-5" />
                    </svg>
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle>确认同步</DialogTitle>
                <div>确定要从 GitHub 拉取最新信息并覆盖本地资料吗？</div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>取消</Button>
                  <Button onClick={handleSync} disabled={syncing}>
                    {syncing ? "同步中..." : "确认同步"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          {editing ? (
            <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center w-full">
              <input
                className="border rounded px-2 py-2 text-base flex-1 min-w-0 w-full sm:w-auto"
                value={nickname}
                onChange={e => setNickname(e.target.value)}
                placeholder="请输入昵称"
              />
              <Button size="sm" className="w-full sm:w-auto" onClick={handleSave}>保存</Button>
              <Button size="sm" variant="outline" className="w-full sm:w-auto" onClick={() => setEditing(false)}>取消</Button>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <span className="text-base sm:text-lg truncate">{session.user?.name || "-"}</span>
              <Button
                size="sm"
                variant="ghost"
                className="p-1 ml-1"
                onClick={() => setEditing(true)}
                aria-label="编辑昵称"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.862 4.487a2.1 2.1 0 1 1 2.97 2.97L7.5 19.79l-4 1 1-4 13.362-13.303ZM19 7l-2-2"
                  />
                </svg>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}