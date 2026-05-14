import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AddVal — Back your community" },
      { name: "description", content: "Buy airtime and data via M-Pesa. A share of every transaction funds the community you choose to back." },
    ],
  }),
  component: IndexRedirect,
});

function IndexRedirect() {
  const navigate = useNavigate();
  useEffect(() => {
    if (typeof window === "undefined") return;
    const userId = localStorage.getItem("addval_user_id");
    navigate({ to: userId ? "/home" : "/onboarding", replace: true });
  }, [navigate]);
  return (
    <main className="min-h-screen bg-background flex items-center justify-center">
      <p className="text-sm text-muted-foreground">Loading…</p>
    </main>
  );
}