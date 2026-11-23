-- ==============================================================================
-- Site Visits Analytics Table & Policies
-- Tracks daily and total site visitors for Jay Ganesh Electrical Admin Dashboard
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.site_visits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visitor_id TEXT NOT NULL,
    page_path TEXT NOT NULL DEFAULT '/',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security
ALTER TABLE public.site_visits ENABLE ROW LEVEL SECURITY;

-- Allow anyone (public/anon & authenticated) to log their visit
CREATE POLICY "Allow public insert to site_visits"
    ON public.site_visits
    FOR INSERT
    TO public
    WITH CHECK (true);

-- Allow authenticated admin users to read visit statistics
CREATE POLICY "Allow admin read site_visits"
    ON public.site_visits
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Fast lookup indexes for daily and total queries
CREATE INDEX IF NOT EXISTS idx_site_visits_created_at ON public.site_visits (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_site_visits_visitor_id ON public.site_visits (visitor_id);
