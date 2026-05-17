import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

// R8: onboarding writes happen through this server-function boundary.
// Service role bypasses RLS — AddVal identity is localStorage-based
// (no Supabase Auth JWT exists at signup time).

const SignupSchema = z.object({
  phone: z.string().min(8).max(20),
  profileType: z.string().min(1).max(40),
  communitySlug: z.enum(["impala-rfc", "soul-sisters"]),
  pinHash: z.string().min(1).max(128),
  referralCode: z.string().min(4).max(16),
});

export const signupUser = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => SignupSchema.parse(input))
  .handler(async ({ data }) => {
    const { data: community, error: cErr } = await supabaseAdmin
      .from("communities")
      .select("id")
      .eq("slug", data.communitySlug)
      .maybeSingle();
    if (cErr || !community) {
      return { ok: false as const, error: "Community not found" };
    }

    const { data: user, error } = await supabaseAdmin
      .from("users")
      .insert({
        phone: data.phone,
        pin_hash: data.pinHash,
        profile_type: data.profileType,
        community_id: community.id,
        referral_code: data.referralCode,
        miles_balance: 0,
      })
      .select("id")
      .single();

    if (error || !user) {
      return { ok: false as const, error: error?.message ?? "Sign up failed" };
    }
    return { ok: true as const, userId: user.id as string };
  });