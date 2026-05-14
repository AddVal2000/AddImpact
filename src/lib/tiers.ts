export function deriveTier(miles: number, slug: string | null) {
  if (slug === "impala-rfc") {
    if (miles >= 500) return { tier: "Impala Legend", next: null, nextAt: 500 };
    if (miles >= 200) return { tier: "Gold Gazelle", next: "Impala Legend", nextAt: 500 };
    if (miles >= 50) return { tier: "Silver Gazelle", next: "Gold Gazelle", nextAt: 200 };
    return { tier: "Bronze Gazelle", next: "Silver Gazelle", nextAt: 50 };
  }
  if (miles >= 500) return { tier: "Soul Icon", next: null, nextAt: 500 };
  if (miles >= 200) return { tier: "Radiant", next: "Soul Icon", nextAt: 500 };
  if (miles >= 50) return { tier: "Bloom", next: "Radiant", nextAt: 200 };
  return { tier: "Seedling", next: "Bloom", nextAt: 50 };
}