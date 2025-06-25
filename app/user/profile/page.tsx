/** @format */

"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { ProfileProviderBadge } from "./ProfileProviderBadge";
import { ProfileAvatar } from "./ProfileAvatar";
import { ProfileSyncButton } from "./ProfileSyncButton";
import { ProfileNickname } from "./ProfileNickname";
import { useProfileStore } from "@/lib/store/profile-store";

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const { profile, provider, fetchProfile } = useProfileStore();
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (!session) return <div className="p-8 text-center">请先登录</div>;

  const handleSave = async (nickname: string) => {
    const res = await fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nickname }),
    });
    if (res.ok && typeof update === "function") {
      await update();
      await fetchProfile();
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      const res = await fetch("/api/profile/sync", { method: "POST" });
      if (res.ok && typeof update === "function") {
        await update();
        await fetchProfile();
      }
    } finally {
      setSyncing(false);
    }
  };

  const handleAvatarUpdate = async () => {
    if (typeof update === "function") {
      await update();
      await fetchProfile();
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-2 py-4 sm:px-4 md:px-8">
      <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 mb-8">
        <div className="flex-shrink-0">
          <ProfileAvatar
            onAvatarUpdate={handleAvatarUpdate}
          />
        </div>
        <div className="flex-1 w-full space-y-2">
          <div className="flex items-center gap-2">
            {profile?.email && (
              <span className="text-lg sm:text-2xl font-bold break-all">
                {profile.email}
              </span>
            )}
            {profile?.phone && (
              <span className="text-lg sm:text-2xl font-bold break-all">
                {profile.phone}
              </span>
            )}
            <ProfileProviderBadge provider={provider} />
          </div>
          <div className="flex items-center gap-2">
            <ProfileNickname user={profile ?? undefined} onSave={handleSave} />
            {provider === "github" && (
              <ProfileSyncButton syncing={syncing} onSync={handleSync} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
