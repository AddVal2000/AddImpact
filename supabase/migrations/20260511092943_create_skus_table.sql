/*
  # Create skus table

  1. New Tables
    - `skus`
      - `id` (uuid, primary key, auto-generated)
      - `sku_code` (text, unique, not null) — product identifier
      - `type` (text, not null) — one of 'data', 'airtime', 'sms'
      - `label` (text, not null) — human-readable product name
      - `price_kes` (integer, not null) — price in Kenyan Shillings
      - `value` (numeric, not null) — quantity of the bundle
      - `value_unit` (text, not null) — unit like 'MB', 'KES', 'SMS'
      - `ttl_hours` (integer, not null) — time-to-live in hours
      - `is_hero` (boolean, default false) — featured hero product
      - `active` (boolean, default true) — whether the SKU is available

  2. Security
    - Enable RLS on `skus` table
    - Add policy for authenticated users to read active SKUs
    - Add policy for anonymous users to read active SKUs (public catalog)

  3. Seed Data
    - 7 SKUs covering data bundles, airtime, and SMS bundles
*/

CREATE TABLE IF NOT EXISTS skus (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sku_code text UNIQUE NOT NULL,
  type text NOT NULL,
  label text NOT NULL,
  price_kes integer NOT NULL,
  value numeric NOT NULL,
  value_unit text NOT NULL,
  ttl_hours integer NOT NULL,
  is_hero boolean DEFAULT false,
  active boolean DEFAULT true
);

ALTER TABLE skus ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active SKUs"
  ON skus FOR SELECT
  TO anon, authenticated
  USING (active = true);

INSERT INTO skus (sku_code, type, label, price_kes, value, value_unit, ttl_hours, is_hero, active) VALUES
  ('SKU-D050', 'data', '50MB Daily Bundle', 50, 50, 'MB', 24, true, true),
  ('SKU-D100', 'data', '150MB Bundle', 100, 150, 'MB', 168, false, true),
  ('SKU-D200', 'data', '350MB Bundle', 200, 350, 'MB', 168, false, true),
  ('SKU-D500', 'data', '1GB Bundle', 500, 1000, 'MB', 720, false, true),
  ('SKU-A100', 'airtime', 'KES 100 Airtime', 100, 100, 'KES', 720, false, true),
  ('SKU-A200', 'airtime', 'KES 200 Airtime', 200, 200, 'KES', 720, false, true),
  ('SKU-S100', 'sms', '200 SMS Bundle', 100, 200, 'SMS', 168, false, true);
