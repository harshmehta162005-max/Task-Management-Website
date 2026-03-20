"use client";

type BillingToggleProps = {
  isYearly: boolean;
  onToggle: () => void;
};

export function BillingToggle({ isYearly, onToggle }: BillingToggleProps) {
  return (
    <div className="flex items-center justify-center gap-4">
      <span className={`text-sm ${!isYearly ? "text-white" : "text-slate-400"}`}>Monthly</span>
      <button
        onClick={onToggle}
        className="relative w-14 h-7 rounded-full p-1 transition-all"
        style={{
          background: "rgba(17, 24, 39, 0.72)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <div
          className="w-5 h-5 bg-white rounded-full transition-all duration-300 absolute top-1"
          style={{ left: isYearly ? "calc(100% - 24px)" : "4px" }}
        />
      </button>
      <span className={`text-sm font-medium flex items-center gap-2 ${isYearly ? "text-white" : "text-slate-400"}`}>
        Yearly
        <span className="bg-[#22D3EE]/20 text-[#22D3EE] text-[10px] px-2 py-0.5 rounded-full border border-[#22D3EE]/30">
          Save 20%
        </span>
      </span>
    </div>
  );
}
