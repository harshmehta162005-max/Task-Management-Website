import { useState } from "react";
import { Plus } from "lucide-react";
import { PendingInvitesList } from "./PendingInvitesList";
import { Select } from "@/components/ui/Select";

type Invite = { email: string; role: "Member" | "Manager" };

type Props = {
  invites: Invite[];
  onInvitesChange: (invites: Invite[]) => void;
  onSkip: () => void;
  onContinue: () => void;
};

export function InviteMembersStep({ invites, onInvitesChange, onSkip, onContinue }: Props) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"Member" | "Manager">("Member");

  const addInvite = () => {
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return;
    onInvitesChange([...invites, { email, role }]);
    setEmail("");
  };

  const removeInvite = (target: string) => {
    onInvitesChange(invites.filter((i) => i.email !== target));
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-[#111827] p-8 shadow-2xl">
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-3">
          <span className="material-symbols-outlined rounded-xl bg-primary/10 p-2 text-primary"></span>
          <h3 className="text-2xl font-bold text-white">Invite your team</h3>
        </div>
        <p className="text-slate-400">Add teammates to collaborate. You can always invite more later.</p>
      </div>

      <div className="flex flex-col gap-3 md:flex-row">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="teammate@company.com"
          className="flex-1 rounded-xl border border-white/10 bg-background-dark px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary"
          type="email"
        />
        <Select
          value={role}
          onChange={(v) => setRole(v as "Member" | "Manager")}
          options={[
            { value: "Member", label: "Member" },
            { value: "Manager", label: "Manager" },
          ]}
          className="md:w-[160px]"
          portal={false}
        />
        <button
          type="button"
          onClick={addInvite}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:bg-primary/90 md:w-[140px]"
        >
          <Plus className="h-4 w-4" />
          Add
        </button>
      </div>

      <div className="mt-4">
        <PendingInvitesList invites={invites} onRemove={removeInvite} />
      </div>

      <div className="mt-6 flex items-center justify-between">
        <button
          type="button"
          onClick={onSkip}
          className="px-6 py-3 text-sm font-semibold text-slate-400 transition hover:text-slate-200"
        >
          Skip
        </button>
        <button
          type="button"
          onClick={onContinue}
          className="rounded-xl bg-primary px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:bg-primary/90 active:scale-[0.98]"
        >
          Send invites & continue
        </button>
      </div>
    </div>
  );
}
