export type Theme = {
  primary: string;
  mode: "impala" | "soul";
  communityName: string;
  ctaVerb: string;
  showStripe: boolean;
};

export const impalaTheme: Theme = {
  primary: "#D41E28",
  mode: "impala",
  communityName: "Impala Rugby",
  ctaVerb: "Back",
  showStripe: true,
};

export const soulTheme: Theme = {
  primary: "#6C3483",
  mode: "soul",
  communityName: "Soul Sisters Nairobi",
  ctaVerb: "Support",
  showStripe: false,
};

export function getTheme(slug: string | null): Theme {
  return slug === "soul-sisters" ? soulTheme : impalaTheme;
}