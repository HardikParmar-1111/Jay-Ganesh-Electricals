-- Migration: Add item_id foreign key to customer_leads
-- Links product requests from catalog directly to customer_leads inquiries

ALTER TABLE public.customer_leads 
ADD COLUMN IF NOT EXISTS item_id UUID REFERENCES public.catalog_items(id) ON DELETE SET NULL;

-- Add index for fast querying on leads by item_id
CREATE INDEX IF NOT EXISTS idx_customer_leads_item_id ON public.customer_leads USING btree (item_id);

-- Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';
