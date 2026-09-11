-- ==============================================================================
-- Migration: 20260912_seed_full_inventory.sql
-- Jay Ganesh Electrical - Full Inventory Seed Script
-- ==============================================================================

-- Insert full inventory items
INSERT INTO public.catalog_items (id, name, category, description, price, image_url, specifications, is_active)
VALUES
  -- ---------------------------------------------------------------------------
  -- CATEGORY: Non-Modular Switches
  -- ---------------------------------------------------------------------------
  (gen_random_uuid(), 'Switch', 'Non-Modular Switches', 'Standard non-modular electrical switch.', 35.00, '', '{}'::jsonb, true),
  (gen_random_uuid(), 'Socket', 'Non-Modular Switches', 'Standard non-modular electrical socket.', 45.00, '', '{}'::jsonb, true),
  (gen_random_uuid(), 'Dimmer', 'Non-Modular Switches', 'Standard non-modular fan/light dimmer.', 120.00, '', '{}'::jsonb, true),
  (gen_random_uuid(), 'Regulator', 'Non-Modular Switches', 'Standard non-modular fan regulator.', 150.00, '', '{}'::jsonb, true),
  (gen_random_uuid(), 'Indicator', 'Non-Modular Switches', 'Standard non-modular power indicator.', 30.00, '', '{}'::jsonb, true),
  (gen_random_uuid(), 'Fuse', 'Non-Modular Switches', 'Standard non-modular electrical fuse.', 25.00, '', '{}'::jsonb, true),
  (gen_random_uuid(), 'DP Switches', 'Non-Modular Switches', 'Standard non-modular Double Pole switch.', 85.00, '', '{}'::jsonb, true),

  -- ---------------------------------------------------------------------------
  -- CATEGORY: Modular Switches
  -- ---------------------------------------------------------------------------
  (gen_random_uuid(), 'Switch', 'Modular Switches', 'Standard modular electrical switch.', 65.00, '', '{}'::jsonb, true),
  (gen_random_uuid(), 'Broad Switch', 'Modular Switches', 'Heavy-duty broad rocker modular switch.', 120.00, '', '{}'::jsonb, true),
  (gen_random_uuid(), 'Socket', 'Modular Switches', 'Standard modular electrical socket.', 90.00, '', '{}'::jsonb, true),
  (gen_random_uuid(), 'Dimmer', 'Modular Switches', 'Standard modular fan/light dimmer.', 250.00, '', '{}'::jsonb, true),
  (gen_random_uuid(), 'Regulator', 'Modular Switches', 'Standard modular fan regulator.', 280.00, '', '{}'::jsonb, true),
  (gen_random_uuid(), 'Blank Plate', 'Modular Switches', 'Modular blank plate for covering unused slots.', 15.00, '', '{}'::jsonb, true),
  (gen_random_uuid(), 'Indicator', 'Modular Switches', 'Modular power indicator.', 45.00, '', '{}'::jsonb, true),

  -- ---------------------------------------------------------------------------
  -- CATEGORY: Boxes & Enclosures
  -- ---------------------------------------------------------------------------
  (gen_random_uuid(), 'Gang Box', 'Boxes & Enclosures', 'Sturdy electrical gang box.', 60.00, '', '{}'::jsonb, true),
  (gen_random_uuid(), 'Switchboard', 'Boxes & Enclosures', 'Standard switchboard enclosure.', 85.00, '', '{}'::jsonb, true),
  (gen_random_uuid(), 'Junction Box', 'Boxes & Enclosures', 'Electrical wiring junction box.', 40.00, '', '{}'::jsonb, true),
  (gen_random_uuid(), 'Surface Box', 'Boxes & Enclosures', 'Surface mounting electrical box.', 55.00, '', '{}'::jsonb, true),
  (gen_random_uuid(), 'Concealed Box', 'Boxes & Enclosures', 'Flush-mounted concealed electrical box.', 50.00, '', '{}'::jsonb, true),
  (gen_random_uuid(), 'Concealed Board', 'Boxes & Enclosures', 'Flush-mounted concealed electrical board.', 95.00, '', '{}'::jsonb, true),

  -- ---------------------------------------------------------------------------
  -- CATEGORY: Switchgears
  -- ---------------------------------------------------------------------------
  (gen_random_uuid(), 'MCB', 'Switchgears', 'Miniature Circuit Breaker.', 250.00, '', '{}'::jsonb, true),
  (gen_random_uuid(), 'RCCB', 'Switchgears', 'Residual Current Circuit Breaker.', 1500.00, '', '{}'::jsonb, true),
  (gen_random_uuid(), 'Isolator', 'Switchgears', 'Electrical isolator switch.', 350.00, '', '{}'::jsonb, true),
  (gen_random_uuid(), 'Mini MCB', 'Switchgears', 'Compact Miniature Circuit Breaker.', 180.00, '', '{}'::jsonb, true),
  (gen_random_uuid(), 'MCB COS', 'Switchgears', 'MCB Change Over Switch.', 850.00, '', '{}'::jsonb, true),
  (gen_random_uuid(), 'MCB Enclosure', 'Switchgears', 'Protective enclosure for MCBs.', 120.00, '', '{}'::jsonb, true),
  (gen_random_uuid(), 'Porcelain Fuse', 'Switchgears', 'Traditional porcelain electrical fuse.', 45.00, '', '{}'::jsonb, true),
  (gen_random_uuid(), 'Distribution Board', 'Switchgears', 'Main electrical distribution board.', 1200.00, '', '{}'::jsonb, true),

  -- ---------------------------------------------------------------------------
  -- CATEGORY: Power Accessories
  -- ---------------------------------------------------------------------------
  (gen_random_uuid(), 'AC Box', 'Power Accessories', 'Air Conditioner power starter box.', 450.00, '', '{}'::jsonb, true),
  (gen_random_uuid(), 'Bulb Holder', 'Power Accessories', 'Standard electrical bulb holder.', 35.00, '', '{}'::jsonb, true),
  (gen_random_uuid(), 'Capacitor', 'Power Accessories', 'Electrical capacitor for appliances.', 80.00, '', '{}'::jsonb, true),
  (gen_random_uuid(), 'Extension Box', 'Power Accessories', 'Multi-socket power extension box.', 350.00, '', '{}'::jsonb, true),
  (gen_random_uuid(), 'Foot Light', 'Power Accessories', 'Low-level foot light for pathways and stairs.', 220.00, '', '{}'::jsonb, true);
