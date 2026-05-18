import { Heart, Zap } from "lucide-react";

export const impalaActiveTheme = {
  primary: "#D41E28",
  mode: "impala" as const,
  communityName: "Impala Rugby",
  ctaVerb: "Back",
  showStripe: true,
};

export const impalaVetTheme = {
  primary: "#8B0000",
  mode: "impala" as const,
  communityName: "Impala Vets",
  ctaVerb: "Back",
  showStripe: true,
};

export const soulSistersTheme = {
  primary: "#6C3483",
  mode: "soul" as const,
  communityName: "Soul Sisters Nairobi",
  ctaVerb: "Support",
  showStripe: false,
};

type Props = {
  theme: {
    primary: string;
    mode: "impala" | "soul";
    communityName: string;
    ctaVerb: string;
    showStripe: boolean;
  };
  sku: { label: string; price: number; value: string };
  onPress: () => void;
};

export default function HeroCard({ theme, sku, onPress }: Props) {
  const stripe = {
    backgroundImage:
      "repeating-linear-gradient(90deg,#D41E28 0 4px,#fff 4px 12px)",
  };
  return (
    <div
      className="w-full rounded-2xl overflow-hidden mb-4 shadow-lg"
      style={{ backgroundColor: theme.primary, color: "#fff" }}
    >
      {theme.showStripe && <div style={{ height: 3, ...stripe }} />}
      <div className="p-5">
        <p className="text-[10px] uppercase tracking-[1.5px] opacity-70 font-semibold">
          Featured Top-Up
        </p>
        <p className="text-[38px] font-bold leading-none mt-1">
          KES {sku.price}
        </p>
        <p className="text-[13px] opacity-80 mt-1">{sku.value}</p>
        <p className="text-[14px] opacity-90 mt-2">{sku.label}</p>

        <div className="border-t border-white/20 mt-4 pt-3 space-y-1.5">
          <p className="text-[12px] opacity-90 flex items-center gap-1.5">
            <Heart size={13} />
            KES {(sku.price * 0.05).toFixed(2)} goes to {theme.communityName}
          </p>
          <p className="text-[12px] opacity-90 flex items-center gap-1.5">
            <Zap size={13} />+{Math.ceil(sku.price * 0.01)} AddVal Miles
          </p>
        </div>

        <button
          onClick={onPress}
          className="w-full font-bold py-[13px] rounded-xl mt-4 bg-white"
          style={{ color: theme.primary }}
        >
          {theme.mode === "soul"
            ? "Support the Sisterhood — Buy Now"
            : "Impala Time — Buy Now"}
        </button>
      </div>
    </div>
  );
}