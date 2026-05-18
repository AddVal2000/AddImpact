import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import HeroCard from "@/components/HeroCard";
import SafaricomStyleCluster from "@/components/SafaricomStyleCluster";
import MilesProgressTracker from "@/components/MilesProgressTracker";
import RebrandedBottomNav from "@/components/RebrandedBottomNav";
import { supabase } from "@/lib/supabaseClient";
import { getUserId, getCommunitySlug } from "@/lib/session";
import { getTheme } from "@/lib/theme";
import { deriveTier } from "@/lib/tiers";

export const Route = createFileRoute("/home")({
  head: () => ({ meta: [{ title: "Home — AddVal" }] }),
  component: HomeScreen,
});

type Sku = {
  sku_code: string;
  category: string;
  type: string;
  label: string;
  value: number;
  value_unit: string;
  price_kes: number;
  ttl_hours: number;
  is_hero: boolean;
};

function timeGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}

function HomeScreen() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ miles_balance: number; referral_code: string } | null>(null);
  const [community, setCommunity] = useState<{
    name: string; raised_kes: number; goal_kes: number; goal_label: string | null;
  } | null>(null);
  const [skus, setSkus] = useState<Sku[]>([]);

  const slug = getCommunitySlug();
  const userId = getUserId();
  const theme = getTheme(slug);

  useEffect(() => {
    if (!userId || !slug) {
      navigate({ to: "/", replace: true });
      return;
    }
    (async () => {
      const sb = supabase as unknown as {
        from: (t: string) => any;
      };
      const skusPromise = sb
        .from("skus")
        .select("*")
        .eq("active", true)
        .order("is_hero", { ascending: false })
        .order("price_kes", { ascending: true })
        .then((r: { data: Sku[] | null }) => r, () => ({ data: [] as Sku[] }));

      const [u, c, s] = await Promise.all([
        supabase.from("users").select("miles_balance, referral_code").eq("id", userId).maybeSingle(),
        supabase.from("communities").select("*").eq("slug", slug).maybeSingle(),
        skusPromise,
      ]);
      setUser({
        miles_balance: u.data?.miles_balance ?? 0,
        referral_code: u.data?.referral_code ?? "",
      });
      setCommunity(
        c.data
          ? {
              name: c.data.name,
              raised_kes: Number(c.data.raised_kes ?? 0),
              goal_kes: Number(c.data.goal_kes ?? 0),
              goal_label: c.data.goal_label ?? null,
            }
          : null,
      );
      setSkus((s as { data: Sku[] | null })?.data ?? []);
      setLoading(false);
    })();
  }, [userId, slug, navigate]);

  const heroSku = skus.find((s) => s.is_hero);
  const clusterA = skus.filter((s) => !s.is_hero && s.category === "daily-weekly");
  const clusterB = skus.filter((s) => !s.is_hero && s.category === "monthly");
  const tier = deriveTier(user?.miles_balance ?? 0, slug);

  return (
    <main className="min-h-screen bg-gray-50 px-5 pt-6 pb-28">
      <div className="mx-auto max-w-md">
        <header className="flex items-start justify-between mb-5">
          <div>
            <p className="text-[12px] text-gray-500">Good {timeGreeting()}</p>
            <h1 className="text-[18px] font-black text-[#0F172A] leading-tight">
              {community?.name ?? "Welcome"}
            </h1>
          </div>
          {user?.referral_code && (
            <span
              className="rounded-lg px-2.5 py-1 text-[10px] font-bold tracking-wider text-white"
              style={{ backgroundColor: "#0F172A" }}
            >
              {user.referral_code}
            </span>
          )}
        </header>

        {loading ? (
          <>
            <div className="w-full h-44 bg-gray-100 rounded-2xl animate-pulse mb-4" />
            <div className="h-16 bg-gray-50 rounded-xl animate-pulse mb-2" />
            <div className="h-16 bg-gray-50 rounded-xl animate-pulse mb-2" />
            <div className="h-16 bg-gray-50 rounded-xl animate-pulse mb-2" />
            <div className="h-28 bg-gray-100 rounded-2xl animate-pulse mt-4" />
          </>
        ) : (
          <>
            {heroSku ? (
              <HeroCard
                theme={theme}
                sku={{
                  label: heroSku.label,
                  price: heroSku.price_kes,
                  value: `${heroSku.value}${heroSku.value_unit} · ${heroSku.ttl_hours}hrs`,
                }}
                onPress={() =>
                  navigate({ to: "/purchase/$skuCode", params: { skuCode: heroSku.sku_code } })
                }
              />
            ) : (
              <div
                className="rounded-2xl p-5 text-white text-sm mb-4"
                style={{ backgroundColor: theme.primary }}
              >
                Top-up catalogue is loading. The transaction engine deploys with the next instruction.
              </div>
            )}

            {(clusterA.length > 0 || clusterB.length > 0) && (
              <SafaricomStyleCluster
                clusters={[
                  {
                    id: "daily-weekly",
                    label: "Daily & Weekly",
                    skus: clusterA.map((s) => ({
                      skuCode: s.sku_code, type: s.type, label: s.label,
                      value: `${s.value}${s.value_unit}`, price: s.price_kes,
                    })),
                  },
                  {
                    id: "monthly",
                    label: "Monthly",
                    skus: clusterB.map((s) => ({
                      skuCode: s.sku_code, type: s.type, label: s.label,
                      value: `${s.value}${s.value_unit}`, price: s.price_kes,
                    })),
                  },
                ]}
                accentColor={theme.primary}
                onSkuSelect={(skuCode) =>
                  navigate({ to: "/purchase/$skuCode", params: { skuCode } })
                }
              />
            )}

            <MilesProgressTracker
              milesBalance={user?.miles_balance ?? 0}
              milesNextTier={tier.nextAt}
              tierName={tier.tier}
              nextTierName={tier.next ?? tier.tier}
              communityName={community?.name ?? ""}
              communitySlug={slug}
              raisedKes={community?.raised_kes ?? 0}
              goalKes={community?.goal_kes ?? 0}
              goalLabel={community?.goal_label ?? null}
            />
          </>
        )}
      </div>

      <RebrandedBottomNav
        activeTab="home"
        onTabChange={(tab) => {
          if (tab !== "home")
            navigate({ to: `/${tab}` as "/miles" | "/perks" | "/profile" });
        }}
      />
    </main>
  );
}