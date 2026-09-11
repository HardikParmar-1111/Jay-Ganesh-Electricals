-- ==============================================================================
-- Migration: Jay Ganesh Electrical - Initial Schema & Granular RLS Policies
-- Description: Complete Supabase PostgreSQL schema, triggers, and RLS security.
-- ==============================================================================

-- 1. Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. TABLE ARCHITECTURE
-- ==============================================================================

-- Table 1: profiles
-- Links directly to auth.users. Role determines access level across the app.
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('admin', 'customer')),
    full_name TEXT,
    phone TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Immediately enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Table 2: catalog_items
-- Retail catalog for electrical supplies (switches, cables, distribution, etc.)
CREATE TABLE IF NOT EXISTS public.catalog_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Immediately enable Row Level Security
ALTER TABLE public.catalog_items ENABLE ROW LEVEL SECURITY;

-- Table 3: portfolio_projects
-- Apartment and home wiring contracting projects
CREATE TABLE IF NOT EXISTS public.portfolio_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    phase TEXT,
    client_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Immediately enable Row Level Security
ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;

-- Table 4: customer_leads
-- Lead generation for contracting and customized electrical estimates
CREATE TABLE IF NOT EXISTS public.customer_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    property_size TEXT,
    services_needed TEXT,
    quality_tier TEXT,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'completed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Immediately enable Row Level Security
ALTER TABLE public.customer_leads ENABLE ROW LEVEL SECURITY;


-- ==============================================================================
-- 3. EXPLICIT B-TREE INDEXES FOR OPTIMAL RLS & QUERY PERFORMANCE
-- ==============================================================================

-- Profiles indexes
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles USING btree (role);

-- Catalog indexes
CREATE INDEX IF NOT EXISTS idx_catalog_items_category ON public.catalog_items USING btree (category);
CREATE INDEX IF NOT EXISTS idx_catalog_items_is_active ON public.catalog_items USING btree (is_active);

-- Portfolio indexes
CREATE INDEX IF NOT EXISTS idx_portfolio_projects_client_id ON public.portfolio_projects USING btree (client_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_projects_phase ON public.portfolio_projects USING btree (phase);

-- Leads indexes (explicit indexes on RLS filter columns prevent full table scans)
CREATE INDEX IF NOT EXISTS idx_customer_leads_user_id ON public.customer_leads USING btree (user_id);
CREATE INDEX IF NOT EXISTS idx_customer_leads_status ON public.customer_leads USING btree (status);
CREATE INDEX IF NOT EXISTS idx_customer_leads_created_at ON public.customer_leads USING btree (created_at DESC);


-- ==============================================================================
-- 4. SECURITY DEFINER FUNCTIONS & TRIGGERS
-- ==============================================================================

-- Optimized is_admin() function
-- Uses SECURITY DEFINER with fixed search_path to bypass RLS recursion on the profiles table
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = (select auth.uid())
      AND role = 'admin'
  );
$$;

-- Trigger Function: handle_new_user()
-- Automatically creates a profile record whenever a new user signs up in auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    'customer'
  )
  ON CONFLICT (id) DO UPDATE
  SET full_name = EXCLUDED.full_name,
      phone = EXCLUDED.phone;
  RETURN NEW;
END;
$$;

-- Trigger setup on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();


-- ==============================================================================
-- 5. GRANULAR ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- Table: profiles
-- ------------------------------------------------------------------------------

-- Customers can view their own profile; Admins can view all profiles
CREATE POLICY "Profiles SELECT policy"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (
    id = (select auth.uid()) OR public.is_admin()
  );

-- Customers can update only their own profile; Admins can update all profiles
CREATE POLICY "Profiles UPDATE policy"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (
    id = (select auth.uid()) OR public.is_admin()
  )
  WITH CHECK (
    id = (select auth.uid()) OR public.is_admin()
  );

-- Admins can insert any profile
CREATE POLICY "Profiles INSERT policy"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (
    public.is_admin() OR id = (select auth.uid())
  );

-- Only Admins can delete profiles
CREATE POLICY "Profiles DELETE policy"
  ON public.profiles
  FOR DELETE
  TO authenticated
  USING (
    public.is_admin()
  );

-- ------------------------------------------------------------------------------
-- Table: catalog_items
-- ------------------------------------------------------------------------------

-- Both anon and authenticated roles can SELECT active catalog items
CREATE POLICY "Catalog SELECT policy"
  ON public.catalog_items
  FOR SELECT
  TO anon, authenticated
  USING (
    is_active = true OR public.is_admin()
  );

-- Only Admins can INSERT new catalog items
CREATE POLICY "Catalog INSERT policy"
  ON public.catalog_items
  FOR INSERT
  TO authenticated
  WITH CHECK (
    public.is_admin()
  );

-- Only Admins can UPDATE catalog items
CREATE POLICY "Catalog UPDATE policy"
  ON public.catalog_items
  FOR UPDATE
  TO authenticated
  USING (
    public.is_admin()
  )
  WITH CHECK (
    public.is_admin()
  );

-- Only Admins can DELETE catalog items
CREATE POLICY "Catalog DELETE policy"
  ON public.catalog_items
  FOR DELETE
  TO authenticated
  USING (
    public.is_admin()
  );

-- ------------------------------------------------------------------------------
-- Table: portfolio_projects
-- ------------------------------------------------------------------------------

-- Both anon and authenticated roles can SELECT portfolio projects
CREATE POLICY "Portfolio SELECT policy"
  ON public.portfolio_projects
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Only Admins can INSERT portfolio projects
CREATE POLICY "Portfolio INSERT policy"
  ON public.portfolio_projects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    public.is_admin()
  );

-- Only Admins can UPDATE portfolio projects
CREATE POLICY "Portfolio UPDATE policy"
  ON public.portfolio_projects
  FOR UPDATE
  TO authenticated
  USING (
    public.is_admin()
  )
  WITH CHECK (
    public.is_admin()
  );

-- Only Admins can DELETE portfolio projects
CREATE POLICY "Portfolio DELETE policy"
  ON public.portfolio_projects
  FOR DELETE
  TO authenticated
  USING (
    public.is_admin()
  );

-- ------------------------------------------------------------------------------
-- Table: customer_leads
-- ------------------------------------------------------------------------------

-- Customers can SELECT only their own leads; Admins can SELECT all leads
CREATE POLICY "Customer leads SELECT policy"
  ON public.customer_leads
  FOR SELECT
  TO authenticated
  USING (
    user_id = (select auth.uid()) OR public.is_admin()
  );

-- Customers can INSERT new leads (with user_id matching auth.uid()); Admins can also insert
CREATE POLICY "Customer leads INSERT policy"
  ON public.customer_leads
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = (select auth.uid()) OR public.is_admin()
  );

-- Admins can UPDATE any lead (status changes, project notes, etc.)
CREATE POLICY "Customer leads UPDATE policy"
  ON public.customer_leads
  FOR UPDATE
  TO authenticated
  USING (
    public.is_admin()
  )
  WITH CHECK (
    public.is_admin()
  );

-- Admins can DELETE leads
CREATE POLICY "Customer leads DELETE policy"
  ON public.customer_leads
  FOR DELETE
  TO authenticated
  USING (
    public.is_admin()
  );
