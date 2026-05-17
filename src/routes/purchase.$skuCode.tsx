import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronLeft, Heart, Zap } from "lucide-react";
import CelebrationOverlay from "@/components/CelebrationOverlay";
import { supabase } from "@/integrations/supabase/client";
import { getUserId, getCommunitySlug } from "@/lib/session";
import { getTheme } from "@/lib/theme";
import { processTransaction, type TransactionResult } from "@/services/transactionService";

export const Route = createFileRoute("/purchase/$skuCode")({
  head: () => ({ meta: [{ title: "Confirm top-up — AddVal" }] }),
  component: PurchaseScreen,
});

type Sku = {
  sku_code: string; label: string; price_kes: number;
  value: number; value_unit: string; ttl_hours: number;
};

function PurchaseScreen() {
  const navigate = useNavigate();
  const { skuCode } = useParams({ from: "/purchase/$skuCode" });
  const slug = getCommunitySlug();
  const userId = getUserId();
  const theme = getTheme(slug);

  const [sku, setSku] = useState<Sku | null>(null);
  const [community, setCommunity] = useState<{ name: string } | null>(null);
  const [mpesaNumber, setMpesaNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");
  const [celebrationOpen, setCelebrationOpen] = useState(false);
  const [celebrationResult, setCelebrationResult] = useState<TransactionResult | null>(null);

  useEffect(() => {
    if (!userId || !slug) {
      navigate({ to: "/", replace: true });
      return;
    }
    (async () => {
      const sb = supabase as unknown as { from: (t: string) => any };
      const skuPromise = sb
        .from("skus").select("*").eq("sku_code", skuCode).maybeSingle()
        .then((r: { data: Sku | null }) => r, () => ({ data: null }));

      const [s, c, u] = await Promise.all([
        skuPromise,
        supabase.from("communities").select("name").eq("slug", slug).maybeSingle(),
        supabase.from("users").select("phone").eq("id", userId).maybeSingle(),
      ]);
      setSku((s as { data: Sku | null }).data);
      setCommunity(c.data ? { name: c.data.name } : null);
      if (u.data?.phone) setMpesaNumber(u.data.phone);
    })();
  }, [skuCode, userId, slug, navigate]);

  const phoneValid = /^\+2547\d{8}$|^\+2541\d{8}$/.test(mpesaNumber);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const handlePurchase = async () => {
    if (!sku || !userId || !slug) return;
    setLoading(true);
    // R4: randomness lives in the UI handler, not in services.
    const transaction_reference = crypto.randomUUID();
    const result = await processTransaction({
      user_id: userId,
      sku_code: skuCode,
      community_slug: slug,
      transaction_reference,
    });
    setLoading(false);
    if (!result.success) {
      showToast(result.error ?? "Something went wrong. Please try again.");
      return;
    }
    setCelebrationResult(result);
    setCelebrationOpen(true);
  };

  if (!sku) {
    return (
      <main className="min-h-screen bg-white px-5 pt-6">
        <button
          onClick={() => navigate({ to: "/home" })}
          className="flex items-center gap-2 text-[#0F172A]"
        >
          <ChevronLeft size={22} />
          <span className="text-[15px] font-semibold">Back</span>
        </button>
        <div className="mt-10 text-center text-sm text-gray-500">
          Top-up catalogue not yet provisioned. Run the database migration to enable purchases.
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white px-5 pt-6 pb-10">
      <div className="mx-auto max-w-md">
        <header className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate({ to: "/home" })}>
            <ChevronLeft size={22} className="text-[#0F172A]" />
          </button>
          <h1 className="text-[17px] font-bold text-[#0F172A]">Confirm top-up</h1>
        </header>

        <section
          className={`bg-gray-50 rounded-2xl p-5 mb-6 ${loading ? "animate-pulse" : ""}`}
        >
          <p className="text-[16px] font-bold text-[#0F172A]">{sku.label}</p>
          <p className="text-[12px] text-gray-400 mt-0.5">Valid {sku.ttl_hours} hrs</p>
          <p className="text-[36px] font-black mt-3" style={{ color: theme.primary }}>
            KES {sku.price_kes}
          </p>
          <div className="border-t border-gray-100 mt-4 pt-4 space-y-1.5">
            <p className="text-[12px] text-gray-500 flex items-center gap-1.5">
              <Heart size={13} />
              KES {(sku.price_kes * 0.05).toFixed(2)} goes to {community?.name ?? "your community"}
            </p>
            <p
              className="text-[12px] flex items-center gap-1.5 font-semibold"
              style={{ color: theme.primary }}
            >
              <Zap size={13} />+{Math.ceil(sku.price_kes * 0.01)} AddVal Miles
            </p>
          </div>
        </section>

        <label className="block text-[12px] font-semibold uppercase tracking-[1px] mb-2 text-[#0F172A]">
          M-Pesa number
        </label>
        <input
          type="tel"
          value={mpesaNumber}
          onChange={(e) => setMpesaNumber(e.target.value)}
          placeholder="+2547XXXXXXXX"
          className="w-full border-2 border-gray-200 rounded-2xl p-4 text-[16px] outline-none"
          style={{ borderColor: phoneValid ? theme.primary : undefined }}
        />

        <button
          onClick={handlePurchase}
          disabled={!phoneValid || loading}
          className="w-full mt-6 text-white py-4 rounded-2xl font-bold text-[15px] flex items-center justify-center"
          style={{
            backgroundColor: theme.primary,
            opacity: !phoneValid || loading ? 0.7 : 1,
          }}
        >
          {loading && (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
          )}
          {loading ? "Processing..." : `Pay KES ${sku.price_kes} via M-Pesa`}
        </button>

        {toast && (
          <div className="fixed top-4 inset-x-4 z-50 rounded-xl bg-[#D41E28] text-white text-sm px-4 py-3 shadow">
            {toast}
          </div>
        )}
      </div>

      {celebrationResult && (
        <CelebrationOverlay
          isOpen={celebrationOpen}
          communityTheme={{
            primary: theme.primary,
            communityName: community?.name ?? "your community",
            communitySlug: slug,
          }}
          result={{
            skuLabel: String(celebrationResult.sku_value ?? sku.value),
            skuUnit: celebrationResult.sku_value_unit ?? sku.value_unit,
            partnerShare: Number(celebrationResult.partner_share ?? 0),
            milesEarned: Number(celebrationResult.miles_earned ?? 0),
            newMilesBalance: Number(celebrationResult.new_miles_balance ?? 0),
            newRaisedKes: Number(celebrationResult.new_raised_kes ?? 0),
          }}
          onShare={() => {
            const msg =
              slug === "impala-rfc"
                ? `I just backed the Gazelles on AddVal! My airtime top-up sends a cut to Impala RFC — no extra cost. Join me: addval.app #ImpalaTime`
                : `My top-ups now support Soul Sisters Nairobi. No extra spend — real sisterhood impact. Join here: addval.app`;
            window.open("https://wa.me/?text=" + encodeURIComponent(msg), "_blank");
          }}
          onDismiss={() => {
            setCelebrationOpen(false);
            navigate({ to: "/home", replace: true });
          }}
        />
      )}
    </main>
  );
}