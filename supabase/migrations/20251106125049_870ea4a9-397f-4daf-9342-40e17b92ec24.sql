-- Fix event_confirmations RLS policies to prevent data exposure while preserving anonymous confirmations

-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Anyone can view confirmations" ON public.event_confirmations;
DROP POLICY IF EXISTS "Anyone can insert confirmations" ON public.event_confirmations;
DROP POLICY IF EXISTS "Anyone can update confirmations" ON public.event_confirmations;

-- Allow editors/admins to view all confirmations (for event management)
CREATE POLICY "Editors and admins can view all confirmations"
ON public.event_confirmations
FOR SELECT
USING (can_edit(auth.uid()));

-- Allow users to view only their own confirmations
CREATE POLICY "Users can view their own confirmations"
ON public.event_confirmations
FOR SELECT
USING (auth.uid() = user_id);

-- Allow anyone to insert confirmations (preserves anonymous confirmation feature)
CREATE POLICY "Anyone can insert confirmations"
ON public.event_confirmations
FOR INSERT
WITH CHECK (true);

-- Only editors/admins can update confirmations
CREATE POLICY "Editors and admins can update confirmations"
ON public.event_confirmations
FOR UPDATE
USING (can_edit(auth.uid()));

-- Fix event_payments RLS to prevent financial data exposure
DROP POLICY IF EXISTS "Anyone can view payments" ON public.event_payments;

CREATE POLICY "Editors and admins can view payments"
ON public.event_payments
FOR SELECT
USING (can_edit(auth.uid()));