type Reward = {
  id: string;
  label: string;
  milesCost: number;
  ttl?: string;
};

type Props = {
  communitySlug: string | null;
  accentColor: string;
  currentGoal: { label: string; targetKes: number; raisedKes: number };
  rewards: Reward[];
};

export default function CommunityRewardsPanel({
  accentColor,
  currentGoal,
  rewards,
}: Props) {
  const pct = Math.min(
    100,
    Math.max(0, (currentGoal.raisedKes / Math.max(1, currentGoal.targetKes)) * 100),
  );
  return (
    <div className="space-y-4">
      <div
        className="rounded-2xl p-5 text-white"
        style={{ backgroundColor: "#0F172A" }}
      >
        <p className="text-[11px] uppercase tracking-[1.2px] text-white/60 font-semibold">
          Current goal
        </p>
        <p className="text-[16px] font-bold mt-1">{currentGoal.label}</p>
        <p className="text-[13px] text-white/70 mt-1">
          KES {currentGoal.raisedKes.toLocaleString()} of{" "}
          {currentGoal.targetKes.toLocaleString()}
        </p>
        <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden mt-3">
          <div
            className="h-full rounded-full"
            style={{
              width: `${pct}%`,
              background:
                pct >= 100
                  ? "#10B981"
                  : "linear-gradient(90deg,#D41E28 0%,#FF6B00 50%,#10B981 100%)",
            }}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-100">
        {rewards.map((r) => (
          <div key={r.id} className="flex items-center gap-3 p-4">
            <span
              className="rounded-lg px-2.5 py-1 text-[12px] font-bold"
              style={{ backgroundColor: accentColor + "18", color: accentColor }}
            >
              {r.milesCost} Miles
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-semibold text-[#0F172A]">{r.label}</p>
              {r.ttl && <p className="text-[11px] text-gray-500">{r.ttl}</p>}
            </div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400 bg-gray-100 rounded-full px-2 py-1">
              Coming soon
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}