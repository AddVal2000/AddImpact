// R6: imports from canonical client only
// R8: this is the SOLE permitted mutation path
//     from the client layer to the transaction engine

export type TransactionPayload = {
  user_id: string;
  sku_code: string;
  community_slug: string;
  // transaction_reference:
  //   A UUID v4 generated via crypto.randomUUID()
  //   in PurchaseScreen's onClick handler — NOT here.
  //   Purpose: idempotency key. The UNIQUE constraint
  //   on public.transactions.transaction_reference
  //   prevents duplicate DB writes on network retry.
  //   Generation stays in the UI handler to keep
  //   this service pure and deterministic. (R4)
  transaction_reference: string;
};

export type TransactionResult = {
  success: boolean;
  transaction_id?: string;
  miles_earned?: number;
  partner_share?: number;
  sku_label?: string;
  sku_value?: string;
  sku_value_unit?: string;
  community_name?: string;
  new_miles_balance?: number;
  new_raised_kes?: number;
  is_retry?: boolean;
  error?: string;
};

export async function processTransaction(
  payload: TransactionPayload,
): Promise<TransactionResult> {
  // Orchestration boundary only.
  // R8: sole permitted write path from client layer.
  // Phase 1 inserts the process_transaction_atomic
  // PL/pgSQL RPC call inside this function.
  // Skeleton returns structured error until the
  // Edge Function and SQL migration are deployed.

  const url =
    `${import.meta.env.VITE_SUPABASE_URL}` +
    "/functions/v1/process-transaction";
  const anonKey =
    (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ??
    (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string);

  // AbortController: 12-second timeout.
  // Required for Safaricom and East African mobile
  // network conditions where latency variance is high.
  // Prevents permanent loading states and disables
  // the duplicate-tap risk on slow connections.
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${anonKey}`,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!res.ok) {
      const err = (await res.json().catch(() => ({}))) as { error?: string };
      return {
        success: false,
        error: err.error ?? "Transaction failed",
      };
    }

    return (await res.json()) as TransactionResult;
  } catch (e: unknown) {
    if (e instanceof Error && e.name === "AbortError") {
      return {
        success: false,
        error: "Request timed out. Please try again.",
      };
    }
    const msg = e instanceof Error ? e.message : "Network error";
    return { success: false, error: msg };
  } finally {
    clearTimeout(timeout);
  }
}

// CRITICAL: Do NOT add supabase.auth.getSession() to
// this file. AddVal does not use Supabase Auth JWT as
// its primary identity model. User identity is managed
// via localStorage (addval_user_id). Any instance of
// supabase.auth.getSession() found here must be removed.