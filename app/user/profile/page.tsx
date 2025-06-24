/** @format */

"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { ProfileProviderBadge } from "./ProfileProviderBadge";
import { ProfileAvatar } from "./ProfileAvatar";
import { ProfileSyncButton } from "./ProfileSyncButton";
import { ProfileNickname } from "./ProfileNickname";
import { User } from "next-auth";

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [provider, setProvider] = useState<string | null>(null);
  const [profileUser, setProfileUser] = useState<User>();
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      const res = await fetch("/api/profile");
      if (res.ok) {
        const data = await res.json();
        setProvider(data.provider);
        setProfileUser(data);
      }
    }
    fetchProfile();
  }, []);

  if (!session) return <div className="p-8 text-center">请先登录</div>;

  const handleSave = async (nickname: string) => {
    const res = await fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nickname }),
    });
    if (res.ok && typeof update === "function") {
      await update();
      // 重新拉取 profile，确保昵称和头像同步
      const profileRes = await fetch("/api/profile");
      if (profileRes.ok) {
        setProfileUser(await profileRes.json());
      }
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      const res = await fetch("/api/profile/sync", { method: "POST" });
      if (res.ok && typeof update === "function") {
        await update();
        // 重新拉取 profile，确保同步后头像刷新
        const profileRes = await fetch("/api/profile");
        if (profileRes.ok) {
          setProfileUser(await profileRes.json());
        }
      }
    } finally {
      setSyncing(false);
    }
  };

  const handleAvatarUpdate = async () => {
    // 更新会话信息以反映新头像
    if (typeof update === "function") {
      await update();
      // 重新拉取 profile，确保头像同步
      const profileRes = await fetch("/api/profile");
      if (profileRes.ok) {
        setProfileUser(await profileRes.json());
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-2 py-4 sm:px-4 md:px-8">
      <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 mb-8">
        <div className="flex-shrink-0">
          <ProfileAvatar
            user={profileUser}
            onAvatarUpdate={handleAvatarUpdate}
          />
        </div>
        <div className="flex-1 w-full space-y-2">
          <div className="flex items-center gap-2">
            {profileUser?.email && (
              <span className="text-lg sm:text-2xl font-bold break-all">
                {profileUser.email}
              </span>
            )}
            {profileUser?.phone && (
              <span className="text-lg sm:text-2xl font-bold break-all">
                {profileUser.phone}
              </span>
            )}
            <ProfileProviderBadge provider={provider} />
          </div>
          <div className="flex items-center gap-2">
            <ProfileNickname user={profileUser} onSave={handleSave} />
            {provider === "github" && (
              <ProfileSyncButton syncing={syncing} onSync={handleSync} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
