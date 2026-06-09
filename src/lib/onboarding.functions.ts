import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

// R8: onboarding writes happen through this server-function boundary.
// Service role bypasses RLS — AddVal identity is localStorage-based
// (no Supabase Auth JWT exists at signup time).

const SignupSchema = z.object({
  phone: z.string().min(8).max(20),
  profileType: z.string().min(1).max(40),
  communitySlug: z.enum(["impala-rugby", "soul-sisters"]),
  pinHash: z.string().min(1).max(128),
  referralCode: z.string().min(4).max(16),
});

export const signupUser = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => SignupSchema.parse(input))
  .handler(async ({ data }) => {
    // Frontend slug → DB slug translation (DB schema retains legacy 'impala-rfc').
    const dbSlug =
      data.communitySlug === "impala-rugby" ? "impala-rfc" : data.communitySlug;
    const { data: community, error: cErr } = await supabaseAdmin
      .from("communities")
      .select("id")
      .eq("slug", dbSlug)
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
      // Handle duplicate phone (PostgreSQL error code 23505)
      if (error && (error as { code?: string }).code === "23505") {
        const { data: existingUser } = await supabaseAdmin
          .from("users")
          .select("id")
          .eq("phone", data.phone)
          .maybeSingle();
        if (existingUser) {
          return { ok: true as const, userId: existingUser.id as string, existing: true };
        }
      }
      return { ok: false as const, error: error?.message ?? "Sign up failed" };
    }
    return { ok: true as const, userId: user.id as string };
  });