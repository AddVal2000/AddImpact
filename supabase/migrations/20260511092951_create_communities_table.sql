/*
  # Create communities table

  1. New Tables
    - `communities`
      - `id` (uuid, primary key, auto-generated)
      - `slug` (text, unique, not null) — URL-safe identifier
      - `name` (text, not null) — display name
      - `team_line` (text, not null) — tagline
      - `raised_kes` (numeric, default 0) — total funds raised
      - `goal_kes` (numeric, not null) — fundraising goal
      - `goal_label` (text, not null) — description of the goal
      - `miles_balance` (integer, default 0) — total community miles balance

  2. Security
    - Enable RLS on `communities` table
    - Add policy for anyone to read community data (public)

  3. Seed Data
    - Impala RFC community
    - Soul Sisters Nairobi community
*/

CREATE TABLE IF NOT EXISTS communities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  team_line text NOT NULL,
  raised_kes numeric DEFAULT 0,
  goal_kes numeric NOT NULL,
  goal_label text NOT NULL,
  miles_balance integer DEFAULT 0
);

ALTER TABLE communities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read communities"
  ON communities FOR SELECT
  TO anon, authenticated
  USING (true);

INSERT INTO communities (slug, name, team_line, raised_kes, goal_kes, goal_label, miles_balance) VALUES
  ('impala-rfc', 'Impala RFC', 'The Gazelles · Roans · Swara', 12500, 100000, 'Tour Fund', 340),
  ('soul-sisters', 'Soul Sisters Nairobi', 'Learn · Laugh · Grow', 8700, 50000, 'Community Programs', 210);
