-- ==============================================================================
-- Migration: 20260912_seed_catalog.sql
-- Jay Ganesh Electrical - Catalog Schema Upgrade & Category Seeding
-- ==============================================================================

ALTER TABLE public.catalog_items ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'Modular Switches';
ALTER TABLE public.catalog_items ADD COLUMN IF NOT EXISTS price NUMERIC(10, 2) DEFAULT 0;
ALTER TABLE public.catalog_items ADD COLUMN IF NOT EXISTS specifications JSONB DEFAULT '{}'::jsonb;

CREATE INDEX IF NOT EXISTS idx_catalog_items_category ON public.catalog_items USING btree (category);
CREATE INDEX IF NOT EXISTS idx_catalog_items_is_active ON public.catalog_items USING btree (is_active);

INSERT INTO public.catalog_items (id, name, category, description, price, image_url, specifications, is_active)
VALUES
  (
    'a1b2c3d4-0001-4000-8000-000000000001',
    'Modular Switch',
    'Modular Switches',
    'Premium 10A 1-Way flush-fit modular switch crafted from fire-retardant virgin polycarbonate with silver-inlay contact tips for smooth, spark-free switching.',
    75.00,
    'https://images.unsplash.com/photo-1558222218-b7b54eede3f3?q=80&w=800&auto=format&fit=crop',
    '{
      "Rated Current": "10A",
      "Voltage Rating": "240V AC 50Hz",
      "Module Size": "1 Module",
      "Contact Material": "Silver Cadmium Oxide Inlay",
      "Body Material": "UV-Stabilized Polycarbonate (FR Grade)",
      "Standard Compliance": "IS 3854:1997",
      "Endurance": "Tested for over 100,000 electrical clicks",
      "Warranty": "10 Years Replacement Warranty"
    }'::jsonb,
    true
  ),
  (
    'a1b2c3d4-0002-4000-8000-000000000002',
    'Broad Switch',
    'Modular Switches',
    'Heavy-duty 20A / 25A broad rocker switch engineered for high-wattage residential and commercial appliances including water geysers, air conditioners, and kitchen equipment.',
    195.00,
    'https://images.unsplash.com/photo-1592652495632-421711df7798?q=80&w=800&auto=format&fit=crop',
    '{
      "Rated Current": "20A / 25A Heavy Duty",
      "Voltage Rating": "240V - 250V AC",
      "Module Size": "2 Module (Broad Rocker)",
      "Indicator": "Integrated Neon Power Indicator",
      "Contact Material": "Heavy Copper Terminals with Silver Bimetal",
      "Recommended Use": "Air Conditioners, Water Heaters, Induction Cooktops",
      "Standard Compliance": "IS 3854:1997",
      "Warranty": "10 Years Replacement Warranty"
    }'::jsonb,
    true
  ),
  (
    'a1b2c3d4-0003-4000-8000-000000000003',
    'Dimmer',
    'Modular Switches',
    'Full 360-degree stepless electronic rotary fan and lighting dimmer with hum-free capacitive speed modulation and energy-saving technology.',
    340.00,
    'https://images.unsplash.com/photo-1558222218-b7b54eede3f3?q=80&w=800&auto=format&fit=crop',
    '{
      "Power Rating": "400W Max Load",
      "Voltage Rating": "230V AC, 50Hz",
      "Module Size": "1 Module",
      "Control Type": "Capacitive Stepless Rotary Knob",
      "Noise Level": "100% Hum-Free Operation",
      "Thermal Protection": "Built-in Overheat Fuse Protection",
      "Application": "Ceiling Fans, Incandescent & Dimmable LED Fixtures",
      "Warranty": "5 Years Domestic Warranty"
    }'::jsonb,
    true
  ),
  (
    'a1b2c3d4-0004-4000-8000-000000000004',
    'MCB',
    'Switchgears',
    'Single Pole (SP) C-Curve Miniature Circuit Breaker designed for precise thermal-magnetic overload and short-circuit protection in residential and commercial distribution boards.',
    285.00,
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop',
    '{
      "Pole Configuration": "Single Pole (1P)",
      "Current Rating": "16A / 32A Available",
      "Breaking Capacity": "10kA (10,000A) Heavy Industrial Grade",
      "Tripping Characteristic": "Type C Curve (5-10 In)",
      "Rated Voltage": "240V / 415V AC",
      "Mounting": "Standard 35mm DIN Rail Mount",
      "Standard Compliance": "IS/IEC 60898-1",
      "Warranty": "5 Years Manufacturer Warranty"
    }'::jsonb,
    true
  ),
  (
    'a1b2c3d4-0005-4000-8000-000000000005',
    'RCCB',
    'Switchgears',
    '4-Pole 40A 30mA Residual Current Circuit Breaker ensuring life-saving instantaneous protection against electrical shocks, earth leakages, and electrical fire hazards.',
    1980.00,
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop',
    '{
      "Pole Configuration": "4-Pole (4P for 3-Phase + Neutral)",
      "Rated Current (In)": "40A",
      "Sensitivity (IΔn)": "30mA (Life Saving Shock Protection)",
      "Operating Voltage": "415V AC, 50/60Hz",
      "Test Feature": "Push-to-Test Monthly Verification Button",
      "Standard Compliance": "IS 12640-1 / IEC 61008-1",
      "Application": "Whole Home Distribution Board Protection",
      "Warranty": "5 Years Manufacturer Warranty"
    }'::jsonb,
    true
  ),
  (
    'a1b2c3d4-0006-4000-8000-000000000006',
    'AC Box',
    'Power Accessories',
    'Complete Modular AC starter power box featuring heavy-duty 25A MCB isolator, universal 3-pin power socket, and corrosion-resistant powder-coated concealed steel enclosure.',
    580.00,
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop',
    '{
      "Power Rating": "25A Heavy Duty (Up to 2.5 Ton AC)",
      "Socket Type": "Universal Multi-Pin Socket with Safety Shutters",
      "Isolator": "Built-in 25A DP Starter Switch / Mini MCB",
      "Enclosure": "Rust-Proof Galvanized Sheet Metal with Polycarbonate Faceplate",
      "Installation": "Concealed or Flush Wall Mount",
      "Surge Protection": "Integrated Line Spike Protection",
      "Warranty": "3 Years Warranty"
    }'::jsonb,
    true
  ),
  (
    'a1b2c3d4-0007-4000-8000-000000000007',
    'Extension Box',
    'Power Accessories',
    'Heavy-duty 4-way master surge-protected extension box equipped with individual neon switches, universal sockets, and 3 meters of 100% pure electrolytic copper cable.',
    490.00,
    'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800&auto=format&fit=crop',
    '{
      "Outlets": "4 Universal Multi-Country Sockets with Safety Shutters",
      "Switches": "4 Dedicated Rocker Switches with Neon Indicators",
      "Cord Length": "3 Meters Heavy Gauge Copper Cable (10A Rated)",
      "Max Power Rating": "2500W - 10A Max Load",
      "Surge Suppression": "Up to 1050 Joules Transient Spike Protection",
      "Safety": "Thermal Overload Circuit Breaker with Manual Reset",
      "Housing": "Flame-Retardant ABS Enclosure",
      "Warranty": "2 Years Replacement Warranty"
    }'::jsonb,
    true
  )
ON CONFLICT (id) DO UPDATE
SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  specifications = EXCLUDED.specifications,
  is_active = EXCLUDED.is_active,
  updated_at = timezone('utc'::text, now());
