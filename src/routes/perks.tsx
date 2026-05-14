import { createFileRoute, useNavigate } from "@tanstack/react-router";
import RebrandedBottomNav from "@/components/RebrandedBottomNav";

export const Route = createFileRoute("/perks")({
  head: () => ({ meta: [{ title: "Perks — AddVal" }] }),
  component: PerksScreen,
});

function PerksScreen() {
  const navigate = useNavigate();
  return (
    <main className="bg-gray-50 min-h-screen flex flex-col items-center justify-center pb-24 px-4">
      <p className="text-[18px] font-bold text-[#0F172A]">Perks</p>
      <p className="text-[13px] text-gray-400 mt-2">
        Community rewards and partner perks — coming soon.
      </p>
      <RebrandedBottomNav
        activeTab="perks"
        onTabChange={(tab) =>
          navigate({ to: `/${tab}` as "/home" | "/miles" | "/perks" | "/profile" })
        }
      />
    </main>
  );
}