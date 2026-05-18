type CardProps = {
  primary: string;
  slug: "impala-rugby" | "soul-sisters";
  name: string;
  tagline: string;
  supporterCount?: number;
  showStripe?: boolean;
  onSelect: (slug: "impala-rugby" | "soul-sisters") => void;
};

const CTA: Record<string, string> = {
  "impala-rugby": "Back the Gazelles →",
  "soul-sisters": "Join the Sisterhood →",
};

export default function CommunitySelectCard({
  primary,
  slug,
  name,
  tagline,
  supporterCount,
  showStripe,
  onSelect,
}: CardProps) {
  const stripe = {
    backgroundImage:
      "repeating-linear-gradient(90deg,#D41E28 0 4px,#fff 4px 12px)",
  };
  return (
    <article
      className="rounded-3xl overflow-hidden text-white shadow-lg"
      style={{ backgroundColor: primary }}
    >
      {showStripe && <div style={{ height: 4, ...stripe }} />}
      <div className="p-6 flex flex-col gap-3 min-h-[280px]">
        <div>
          <h2 className="text-[26px] font-black leading-tight">{name}</h2>
          <p className="text-[14px] opacity-85 mt-1">{tagline}</p>
        </div>
        {supporterCount != null && (
          <p className="text-[12px] opacity-75 mt-auto">
            {supporterCount.toLocaleString()} supporters
          </p>
        )}
        <button
          onClick={() => onSelect(slug)}
          className="mt-4 bg-white font-bold rounded-xl py-3"
          style={{ color: primary }}
        >
          {CTA[slug]}
        </button>
      </div>
    </article>
  );
}

export function CommunitySelectScreen({
  onSelect,
}: {
  onSelect: (slug: "impala-rugby" | "soul-sisters") => void;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      <CommunitySelectCard
        primary="#D41E28"
        slug="impala-rugby"
        name="Impala Rugby"
        tagline="The Gazelles · Roans · Swara"
        showStripe
        onSelect={onSelect}
      />
      <CommunitySelectCard
        primary="#6C3483"
        slug="soul-sisters"
        name="Soul Sisters Nairobi"
        tagline="Learn · Laugh · Grow"
        onSelect={onSelect}
      />
    </div>
  );
}