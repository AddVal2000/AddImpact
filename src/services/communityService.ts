import { supabase } from "../lib/supabaseClient";
// R6: single canonical Supabase import.

export type Community = {
  id: string;
  slug: string;
  name: string;
  raised_kes: number;
  goal_kes: number;
  goal_label: string;
  phase: number;
  active: boolean;
};

export type Sku = {
  id: string;
  sku_code: string;
  category: string;
  type: string;
  label: string;
  value: number;
  value_unit: string;
  price_kes: number;
  ttl_hours: number;
  is_hero: boolean;
  active: boolean;
};

export async function getCommunity(slug: string): Promise<Community | null> {
  // Translate frontend slug 'impala-rugby' → DB slug 'impala-rfc' (no schema change).
  const dbSlug = slug === "impala-rugby" ? "impala-rfc" : slug;
  const { data, error } = await supabase
    .from("communities")
    .select("*")
    .eq("slug", dbSlug)
    .eq("active", true)
    .single();
  if (error) return null;
  return data as unknown as Community;
}

export async function getActiveSkus(): Promise<Sku[]> {
  const { data, error } = await (supabase as unknown as {
    from: (t: string) => {
      select: (s: string) => {
        eq: (c: string, v: unknown) => {
          order: (c: string, o: { ascending: boolean }) => {
            order: (c: string, o: { ascending: boolean }) => Promise<{
              data: Sku[] | null;
              error: unknown;
            }>;
          };
        };
      };
    };
  })
    .from("skus")
    .select("*")
    .eq("active", true)
    .order("is_hero", { ascending: false })
    .order("price_kes", { ascending: true });
  if (error) return [];
  return (data ?? []) as Sku[];
}

export async function getSkuByCode(skuCode: string): Promise<Sku | null> {
  const { data, error } = await (supabase as unknown as {
    from: (t: string) => {
      select: (s: string) => {
        eq: (c: string, v: unknown) => {
          eq: (c: string, v: unknown) => {
            single: () => Promise<{ data: Sku | null; error: unknown }>;
          };
        };
      };
    };
  })
    .from("skus")
    .select("*")
    .eq("sku_code", skuCode)
    .eq("active", true)
    .single();
  if (error) return null;
  return data as Sku;
}