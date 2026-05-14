import { useEffect, useState } from "react";
import { Check, Share2, X } from "lucide-react";

type Props = {
  isOpen: boolean;
  communityTheme: {
    primary: string;
    communityName: string;
    communitySlug: string | null;
  };
  result: {
    skuLabel: string;
    skuUnit: string;
    partnerShare: number;
    milesEarned: number;
    newMilesBalance: number;
    newRaisedKes: number;
  };
  onShare: () => void;
  onDismiss: () => void;
};

const STYLE = `
@keyframes overlaySlide { from { transform: translateY(100%) } to { transform: translateY(0) } }
@keyframes checkPop { from { transform: scale(0); opacity: 0 } to { transform: scale(1); opacity: 1 } }
@keyframes confettiFall { from { transform: translateY(-30px); opacity: 0 } to { transform: translateY(80px); opacity: 1 } }
`;

export default function CelebrationOverlay({
  isOpen,
  communityTheme,
  result,
  onShare,
  onDismiss,
}: Props) {
  const [stage, setStage] = useState<1 | 2>(1);

  useEffect(() => {
    if (!isOpen) {
      setStage(1);
      return;
    }
    const t = setTimeout(() => setStage(2), 1500);
    return () => clearTimeout(t);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end">
      <style>{STYLE}</style>
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onDismiss}
      />
      <div
        className="relative w-full rounded-t-3xl text-white p-6 pb-10"
        style={{
          backgroundColor: communityTheme.primary,
          animation: "overlaySlide 350ms cubic-bezier(0.32,0.72,0,1) forwards",
        }}
      >
        <div className="mx-auto h-1.5 w-12 rounded-full bg-white/30 mb-5" />

        <button
          onClick={onDismiss}
          className="absolute top-4 right-4 text-white/70"
          aria-label="Close"
        >
          <X size={22} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div
            className="h-16 w-16 rounded-full bg-white flex items-center justify-center mb-4"
            style={{
              animation: "checkPop 400ms cubic-bezier(0.34,1.56,0.64,1) forwards",
            }}
          >
            <Check size={36} color={communityTheme.primary} strokeWidth={3} />
          </div>

          {stage === 1 ? (
            <>
              <h2 className="text-[22px] font-black">Top-up confirmed</h2>
              <p className="text-[14px] opacity-90 mt-1">
                {result.skuLabel} {result.skuUnit} on its way
              </p>
              <div className="mt-4 px-4 py-2 rounded-full bg-white/15 text-[13px] font-bold">
                +{result.milesEarned} Miles · Balance {result.newMilesBalance}
              </div>
            </>
          ) : (
            <>
              <h2 className="text-[22px] font-black">Impact Confirmed!</h2>
              <p className="text-[14px] opacity-95 mt-2 px-4">
                KES {result.partnerShare.toFixed(2)} has been successfully directed
                to {communityTheme.communityName}.
              </p>
              <div className="mt-3 px-4 py-2 rounded-full bg-white/15 text-[13px] font-bold">
                +{result.milesEarned} Miles · Balance {result.newMilesBalance}
              </div>

              <div className="relative h-12 w-full overflow-hidden mt-2">
                {Array.from({ length: 14 }).map((_, i) => (
                  <span
                    key={i}
                    className="absolute top-0 h-2 w-2 rounded-sm"
                    style={{
                      left: `${(i * 7) % 100}%`,
                      backgroundColor: i % 2 ? "#FF6B00" : "#fff",
                      animation: `confettiFall 900ms ease-out ${i * 60}ms forwards`,
                    }}
                  />
                ))}
              </div>

              <div className="w-full mt-2 space-y-2">
                <button
                  onClick={onShare}
                  className="w-full flex items-center justify-center gap-2 rounded-xl py-3 font-bold text-white"
                  style={{ backgroundColor: "#25D366" }}
                >
                  <Share2 size={18} />
                  Share on WhatsApp
                </button>
                <button
                  onClick={onDismiss}
                  className="w-full rounded-xl py-3 font-bold bg-white"
                  style={{ color: communityTheme.primary }}
                >
                  Done
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}