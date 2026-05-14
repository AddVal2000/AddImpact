import { useState } from "react";
import { Wifi, Phone, MessageSquare, ChevronRight } from "lucide-react";

type Sku = {
  skuCode: string;
  type: string;
  label: string;
  value: string;
  price: number;
};

type Cluster = { id: string; label: string; skus: Sku[] };

type Props = {
  clusters: Cluster[];
  accentColor: string;
  onSkuSelect: (skuCode: string) => void;
};

function iconFor(type: string) {
  if (type === "data") return Wifi;
  if (type === "sms") return MessageSquare;
  return Phone;
}

export default function SafaricomStyleCluster({
  clusters,
  accentColor,
  onSkuSelect,
}: Props) {
  const [active, setActive] = useState(clusters[0]?.id ?? "daily-weekly");
  const current = clusters.find((c) => c.id === active);

  return (
    <section className="mt-5">
      <p className="text-[12px] font-semibold uppercase tracking-[1px] text-gray-500 mb-2">
        More top-ups
      </p>
      <div className="flex gap-2 mb-3">
        {clusters.map((c) => {
          const isActive = c.id === active;
          return (
            <button
              key={c.id}
              onClick={() => setActive(c.id)}
              className="px-3 py-1.5 rounded-full text-[12px] font-semibold"
              style={{
                backgroundColor: isActive ? accentColor : "#F3F4F6",
                color: isActive ? "#fff" : "#0F172A",
              }}
            >
              {c.label}
            </button>
          );
        })}
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-100">
        {current?.skus.map((s) => {
          const Icon = iconFor(s.type);
          return (
            <button
              key={s.skuCode}
              onClick={() => onSkuSelect(s.skuCode)}
              className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50"
            >
              <div
                className="h-10 w-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: accentColor + "18", color: accentColor }}
              >
                <Icon size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-[#0F172A]">{s.label}</p>
                <p className="text-[12px] text-gray-500">{s.value}</p>
              </div>
              <span
                className="px-2.5 py-1 rounded-lg text-[12px] font-bold"
                style={{ backgroundColor: accentColor + "18", color: accentColor }}
              >
                KES {s.price}
              </span>
              <ChevronRight size={18} className="text-gray-400" />
            </button>
          );
        })}
      </div>
    </section>
  );
}