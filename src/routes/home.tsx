import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/home")({
  head: () => ({
    meta: [
      { title: "Home — AddVal" },
      { name: "description", content: "Your AddVal home." },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <main className="min-h-screen bg-background px-4 py-12">
      <div className="mx-auto max-w-md text-center">
        <h1 className="text-3xl font-bold text-foreground">You're in 🎉</h1>
        <p className="mt-3 text-muted-foreground">
          Your account is set up. The home dashboard, M-Pesa flow, and Miles
          balance are coming next.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block rounded-xl bg-primary px-5 py-3 text-primary-foreground font-semibold"
        >
          Switch community
        </Link>
      </div>
    </main>
  );
}