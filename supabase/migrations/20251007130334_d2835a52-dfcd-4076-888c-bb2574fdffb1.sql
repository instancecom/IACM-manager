-- Allow anyone (including non-authenticated users) to insert members
-- This is needed for public event confirmations
CREATE POLICY "Anyone can insert members for event confirmations"
ON public.members
FOR INSERT
TO public
WITH CHECK (true);

-- Also allow anyone to update members (in case they need to update their info)
CREATE POLICY "Anyone can update members"
ON public.members
FOR UPDATE
TO public
USING (true);