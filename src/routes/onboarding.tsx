import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import OnboardingWizard from "@/components/OnboardingWizard";
import { setSession } from "@/lib/session";
import { signupUser } from "@/lib/onboarding.functions";

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
  const signup = useServerFn(signupUser);

  const handleComplete = async (data: {
    phone: string;
    profileType: string;
    communitySlug: "impala-rugby" | "soul-sisters";
  }) => {
    setErr("");
    try {
      const result = await signup({
        data: {
          phone: data.phone,
          profileType: data.profileType,
          communitySlug: data.communitySlug,
          pinHash: "MOCK_HASH",
          referralCode: genReferral(),
        },
      });
      if (!result.ok) throw new Error(result.error);
      setSession(result.userId, data.communitySlug);
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