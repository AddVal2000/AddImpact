
CREATE TABLE public.communities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  theme text NOT NULL,
  phase integer DEFAULT 1,
  goal_kes integer,
  goal_label text,
  raised_kes integer DEFAULT 0,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE public.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone text UNIQUE NOT NULL,
  pin_hash text NOT NULL,
  profile_type text NOT NULL,
  community_id uuid REFERENCES public.communities(id),
  referral_code text UNIQUE,
  referred_by uuid REFERENCES public.users(id),
  miles_balance integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Communities are publicly readable"
  ON public.communities FOR SELECT
  USING (true);

-- users table: no public policies. Access only via service role (server functions).
INSERT INTO public.communities (slug, name, theme, phase, goal_kes, goal_label, raised_kes, active) VALUES
  ('impala-rfc', 'Impala RFC', 'impala_active', 1, 50000, 'Floodlit Kit Fund', 0, true),
  ('soul-sisters', 'Soul Sisters Nairobi', 'soul_sisters', 1, 30000, 'Wealth Building Masterclass', 0, true);
