import { useEffect } from "react";
import { CheckCircle2, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type Props = {
  message: string | null;
  onClose: () => void;
};

export function ToastContainer({ message, onClose }: Props) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onClose, 2500);
    return () => clearTimeout(t);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="pointer-events-none fixed bottom-6 right-4 z-50 flex flex-col gap-2">
      <div className="pointer-events-auto flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/15 px-4 py-3 text-sm font-semibold text-emerald-100 shadow-lg shadow-emerald-900/20">
        <CheckCircle2 className="h-4 w-4" />
        <span>{message}</span>
        <button
          type="button"
          onClick={onClose}
          className={cn("ml-auto inline-flex h-7 w-7 items-center justify-center rounded-lg hover:bg-white/10")}
          aria-label="Close toast"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
