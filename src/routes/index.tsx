import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AddVal — Back your community" },
      {
        name: "description",
        content:
          "Buy airtime and data via M-Pesa. A share of every transaction funds the community you choose to back.",
      },
    ],
  }),
  component: CommunitySelect,
});

type Choice = {
  slug: "impala-rfc" | "soul-sisters";
  title: string;
  sub: string;
  cta: string;
  bg: string;
  fg: string;
};

const CHOICES: Choice[] = [
  {
    slug: "impala-rfc",
    title: "Impala RFC",
    sub: "The Gazelles · Roans · Swara",
    cta: "Back the Gazelles",
    bg: "bg-impala",
    fg: "text-impala",
  },
  {
    slug: "soul-sisters",
    title: "Soul Sisters Nairobi",
    sub: "Learn · Laugh · Grow",
    cta: "Join the Sisterhood",
    bg: "bg-soul",
    fg: "text-soul",
  },
];

function CommunitySelect() {
  const navigate = useNavigate();
  const select = (slug: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("community_slug", slug);
    }
    navigate({ to: "/onboarding" });
  };

  return (
    <main className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">AddVal</h1>
          <p className="mt-2 text-muted-foreground">
            Choose the community you want to back.
          </p>
        </header>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {CHOICES.map((c) => (
            <article
              key={c.slug}
              className={`${c.bg} text-white rounded-3xl p-7 flex flex-col justify-between min-h-[320px] shadow-lg`}
            >
              <div>
                <h2 className="text-3xl font-bold">{c.title}</h2>
                <p className="mt-2 text-white/85">{c.sub}</p>
              </div>
              <button
                onClick={() => select(c.slug)}
                className={`mt-8 rounded-xl bg-white ${c.fg} font-semibold px-5 py-3 transition hover:bg-white/90`}
              >
                {c.cta}
              </button>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
