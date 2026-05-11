import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const SignupSchema = z.object({
  phone: z.string().regex(/^\+254(7|1)\d{8}$/, "Invalid Kenyan phone"),
  pin: z.string().regex(/^\d{4}$/),
  profile_type: z.enum(["fan", "player", "vet", "sister", "supporter"]),
  community_slug: z.enum(["impala-rfc", "soul-sisters"]),
});

function genReferral(slug: string) {
  const prefix = slug === "impala-rfc" ? "GAZ" : "SIS";
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return `${prefix}-${code}`;
}

export const signupUser = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => SignupSchema.parse(data))
  .handler(async ({ data }) => {
    const { data: community, error: cErr } = await supabaseAdmin
      .from("communities")
      .select("id")
      .eq("slug", data.community_slug)
      .maybeSingle();
    if (cErr || !community) throw new Error("Community not found");

    const pin_hash = await bcrypt.hash(data.pin, 10);

    let referral_code = genReferral(data.community_slug);
    for (let i = 0; i < 5; i++) {
      const { data: existing } = await supabaseAdmin
        .from("users")
        .select("id")
        .eq("referral_code", referral_code)
        .maybeSingle();
      if (!existing) break;
      referral_code = genReferral(data.community_slug);
    }

    const { data: user, error } = await supabaseAdmin
      .from("users")
      .insert({
        phone: data.phone,
        pin_hash,
        profile_type: data.profile_type,
        community_id: community.id,
        referral_code,
        miles_balance: 0,
      })
      .select("id, referral_code")
      .single();
    if (error) throw new Error(error.message);
    return { id: user.id, referral_code: user.referral_code };
  });