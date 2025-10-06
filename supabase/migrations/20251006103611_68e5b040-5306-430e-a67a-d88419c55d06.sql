-- Drop existing policies for event_confirmations
DROP POLICY IF EXISTS "Authenticated users can manage confirmations" ON public.event_confirmations;
DROP POLICY IF EXISTS "Users can view all confirmations" ON public.event_confirmations;

-- Allow anyone to view confirmations
CREATE POLICY "Anyone can view confirmations"
ON public.event_confirmations
FOR SELECT
USING (true);

-- Allow anyone to insert confirmations (for public event registration)
CREATE POLICY "Anyone can insert confirmations"
ON public.event_confirmations
FOR INSERT
WITH CHECK (true);

-- Allow anyone to update confirmations
CREATE POLICY "Anyone can update confirmations"
ON public.event_confirmations
FOR UPDATE
USING (true);

-- Allow editors and admins to delete confirmations
CREATE POLICY "Editors and admins can delete confirmations"
ON public.event_confirmations
FOR DELETE
USING (can_edit(auth.uid()));