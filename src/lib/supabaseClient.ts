// R6: single canonical Supabase client for all service files.
// Re-exports the project's generated browser client to guarantee
// one instance (avoids duplicate GoTrue and dual auth storage).
export { supabase } from "@/integrations/supabase/client";