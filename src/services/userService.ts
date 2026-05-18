import { supabase } from "@/lib/supabaseClient";

export type UserProfile = {
  id: string;
  phone: string;
  miles_balance: number;
  referral_code: string;
  community_id: string;
};

export async function getUserById(
  userId: string,
): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from("users")
    .select("id, phone, miles_balance, referral_code, community_id")
    .eq("id", userId)
    .single();
  if (error || !data) return null;
  return data as UserProfile;
}

// Additional user reads consolidated here in Gate 1.
// DO NOT add mutations to this file.
// User creation remains in src/lib/onboarding.functions.ts (server fn).