import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import OnboardingWizard from "@/components/OnboardingWizard";
import { supabase } from "@/integrations/supabase/client";
import { setSession } from "@/lib/session";

export const Route = createFileRoute("/onboarding")({
  head: () => ({ meta: [{ title: "Get started — AddVal" }] }),
  component: OnboardingPage,
});

function genReferral() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

function OnboardingPage() {
  const navigate = useNavigate();
  const [err, setErr] = useState("");

  const handleComplete = async (data: {
    phone: string;
    profileType: string;
    communitySlug: "impala-rfc" | "soul-sisters";
  }) => {
    setErr("");
    try {
      const { data: community, error: cErr } = await supabase
        .from("communities").select("id").eq("slug", data.communitySlug).maybeSingle();
      if (cErr || !community) throw new Error(cErr?.message ?? "Community not found");

      const { data: user, error } = await supabase
        .from("users")
        .insert({
          phone: data.phone,
          pin_hash: "MOCK_HASH",
          profile_type: data.profileType,
          community_id: community.id,
          referral_code: genReferral(),
          miles_balance: 0,
        })
        .select("id").single();
      if (error || !user) throw new Error(error?.message ?? "Sign up failed");

      setSession(user.id, data.communitySlug);
      navigate({ to: "/home", replace: true });
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Sign up failed");
    }
  };

  return (
    <>
      {err && (
        <div className="fixed top-4 inset-x-4 z-50 rounded-xl bg-[#D41E28] text-white text-sm px-4 py-3 shadow">
          {err}
        </div>
      )}
      <OnboardingWizard onComplete={handleComplete} />
    </>
  );
}