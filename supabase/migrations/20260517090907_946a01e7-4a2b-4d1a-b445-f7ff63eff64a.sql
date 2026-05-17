DROP POLICY IF EXISTS users_self ON public.users;
DROP POLICY IF EXISTS users_insert_onboarding ON public.users;
DROP POLICY IF EXISTS users_select_own ON public.users;

CREATE POLICY users_insert_onboarding
  ON public.users FOR INSERT WITH CHECK (true);

CREATE POLICY users_select_own
  ON public.users FOR SELECT
  USING (id::text = current_setting('app.user_id', true));