import { Home, Gift, User } from "lucide-react";

type Tab = "home" | "miles" | "perks" | "profile";

type Props = {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
};

function RugbyIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width={22}
      height={22}
      stroke="currentColor"
      fill="none"
      strokeWidth={1.75}
      strokeLinecap="round"
    >
      <ellipse cx="12" cy="12" rx="9" ry="4.5" transform="rotate(45 12 12)" />
      <line x1="5.5" y1="18.5" x2="18.5" y2="5.5" />
      <line x1="9.5" y1="11" x2="11" y2="9.5" />
      <line x1="13" y1="14.5" x2="14.5" y2="13" />
    </svg>
  );
}

const TABS: { id: Tab; label: string; Icon: React.ComponentType<{ size?: number }> | null }[] = [
  { id: "home", label: "Home", Icon: Home },
  { id: "perks", label: "Perks", Icon: Gift },
  { id: "miles", label: "My Miles", Icon: null },
  { id: "profile", label: "Profile", Icon: User },
];

export default function RebrandedBottomNav({ activeTab, onTabChange }: Props) {
  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-50 border-t"
      style={{
        backgroundColor: "#0F172A",
        borderColor: "rgba(255,255,255,0.08)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      <div className="flex justify-around items-stretch">
        {TABS.map(({ id, label, Icon }) => {
          const isActive = id === activeTab;
          const color = isActive ? "#FF6B00" : "rgba(255,255,255,0.35)";
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className="flex-1 flex flex-col items-center justify-center pt-2 pb-2 relative"
              style={{ color }}
            >
              {isActive && (
                <span
                  className="absolute top-0 h-[3px] w-[3px] rounded-full"
                  style={{ backgroundColor: "#FF6B00" }}
                />
              )}
              {Icon ? <Icon size={22} /> : <RugbyIcon />}
              <span className="text-[10px] font-semibold mt-1">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}