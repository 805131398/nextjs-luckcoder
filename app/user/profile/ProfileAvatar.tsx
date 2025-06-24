import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User } from "next-auth";

interface ProfileAvatarProps {
  user: User | undefined;
}

export function ProfileAvatar({ user }: ProfileAvatarProps) {
  return (
    <Avatar className="w-16 h-16 sm:w-20 sm:h-20">
      <AvatarImage src={user?.image || undefined} alt={user?.name || "用户"} />
      <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
    </Avatar>
  );
} 