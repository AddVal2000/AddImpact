// Orchestration boundary only.
// This function receives the client request and
// delegates all business logic to the
// process_transaction_atomic PL/pgSQL RPC in Phase 1.
// No commission mathematics, no direct table mutations,
// and no transaction calculations belong in this file.
// The database layer owns all transactional logic.

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS")
    return new Response("ok", { headers: corsHeaders });

  try {
    const body = (await req.json()) as {
      user_id: string;
      sku_code: string;
      community_slug: string;
      transaction_reference: string;
    };

    const { user_id, sku_code, community_slug, transaction_reference } = body;

    if (!user_id || !sku_code || !community_slug || !transaction_reference) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Phase 1 inserts the process_transaction_atomic
    // RPC call here. All atomic writes — commission
    // calculation, miles ledger, community funding —
    // are handled by the PL/pgSQL function, not here.
    return new Response(
      JSON.stringify({
        success: false,
        error: "Awaiting Phase 1 SQL migration",
      }),
      {
        status: 503,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});