import { Loader2 } from "lucide-react";

type Props = { message: string };

export function AutoRedirectBanner({ message }: Props) {
  return (
    <div className="w-full rounded-xl border border-primary/20 bg-primary/10 p-4 text-slate-200">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <p className="text-sm font-medium">
            Redirecting you to <span className="text-primary">{message}</span>...
          </p>
        </div>
        <div className="hidden items-center gap-4 text-xs text-slate-400 sm:flex">
          <div className="h-1.5 w-24 overflow-hidden rounded-full bg-primary/20">
            <div className="h-full w-2/3 rounded-full bg-primary" />
          </div>
          <span className="font-mono">05s</span>
        </div>
      </div>
    </div>
  );
}
