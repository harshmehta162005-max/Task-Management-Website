"use client";

import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileInfoCard } from "@/components/profile/ProfileInfoCard";
import { AvatarCard } from "@/components/profile/AvatarCard";
import { PasswordCard } from "@/components/profile/PasswordCard";
import { PreferencesCard } from "@/components/profile/PreferencesCard";
import { SessionsCard } from "@/components/profile/SessionsCard";
import { DeleteAccountCard } from "@/components/profile/DeleteAccountCard";
import { ProfileSkeleton } from "@/components/profile/ProfileSkeleton";
import { useCurrentUser } from "@/components/providers/UserProvider";

const sessions = [
  { id: "s1", device: 'MacBook Pro 16"', browser: "Chrome", location: "New Delhi, India", lastActive: "Active now", active: true },
  { id: "s2", device: "iPhone 15 Pro", browser: "TeamOS iOS App", location: "Mumbai, India", lastActive: "3 hours ago" },
];

export default function ProfilePage() {
  const { user, isLoading } = useCurrentUser();

  if (isLoading || !user) return <ProfileSkeleton />;

  return (
    <div className="workspace-bg min-h-screen">
      <main className="mx-auto max-w-[900px] px-4 py-8 space-y-6">
        <ProfileHeader />
        <ProfileInfoCard initialName={user.name ?? ""} initialEmail={user.email} onSave={() => {}} />
        <AvatarCard initialAvatar={user.avatarUrl ?? undefined} name={user.name ?? "User"} />
        <PasswordCard />
        <PreferencesCard timezone={user.timezone} language={user.language} onTimezoneChange={() => {}} onLanguageChange={() => {}} />
        <SessionsCard sessions={sessions} />
        <DeleteAccountCard email={user.email} />
      </main>
    </div>
  );
}
