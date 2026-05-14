type Props = {
  milesBalance: number;
  milesNextTier: number;
  tierName: string;
  nextTierName: string;
  communityName: string;
  communitySlug: string | null;
  raisedKes: number;
  goalKes: number;
  goalLabel?: string | null;
};

export default function MilesProgressTracker({
  milesBalance,
  milesNextTier,
  tierName,
  nextTierName,
  communityName,
  communitySlug,
  raisedKes,
  goalKes,
  goalLabel,
}: Props) {
  const pct = Math.min(100, Math.max(0, (milesBalance / milesNextTier) * 100));
  const raisedPct = Math.min(100, Math.max(0, (raisedKes / Math.max(1, goalKes)) * 100));
  const currencyLabel =
    communitySlug === "soul-sisters" ? "Soul Miles" : "Gazelle Miles";

  return (
    <div
      className="rounded-2xl p-5 mt-5 text-white"
      style={{ backgroundColor: "#0F172A" }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[1.2px] text-white/60 font-semibold">
            {currencyLabel} earned
          </p>
          <p className="text-[42px] font-black leading-none mt-1">{milesBalance}</p>
        </div>
        <span
          className="rounded-full px-3 py-1 text-[12px] font-bold"
          style={{ backgroundColor: "rgba(255,107,0,0.2)", color: "#FF6B00" }}
        >
          {tierName}
        </span>
      </div>

      <div className="mt-4">
        <div className="h-2.5 w-full rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: `${pct}%`,
              background:
                "linear-gradient(90deg,#D41E28 0%,#FF6B00 50%,#10B981 100%)",
              boxShadow: "0 0 8px #FF6B00",
              transition: "width 600ms ease",
            }}
          />
        </div>
        <p className="text-[11px] text-white/70 mt-2">
          {Math.max(0, milesNextTier - milesBalance)} Miles to unlock {nextTierName}
        </p>
      </div>

      <div className="mt-5 pt-4 border-t border-white/10">
        <p className="text-[11px] uppercase tracking-[1.2px] text-white/60 font-semibold">
          {communityName} progress
        </p>
        <p className="text-[14px] mt-1">
          KES {raisedKes.toLocaleString()} of {goalKes.toLocaleString()}
        </p>
        {goalLabel && (
          <p className="text-[11px] text-white/60 mt-0.5">{goalLabel}</p>
        )}
        <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden mt-2">
          <div
            className="h-full rounded-full"
            style={{
              width: `${raisedPct}%`,
              background:
                raisedPct >= 100
                  ? "#10B981"
                  : "linear-gradient(90deg,#D41E28 0%,#FF6B00 50%,#10B981 100%)",
              transition: "width 600ms ease",
            }}
          />
        </div>
      </div>
    </div>
  );
}