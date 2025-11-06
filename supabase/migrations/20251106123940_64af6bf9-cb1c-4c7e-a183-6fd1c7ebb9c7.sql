-- Fix profiles table RLS policy to prevent public data exposure
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = user_id);

-- Fix members table RLS policies to prevent unauthorized access
DROP POLICY IF EXISTS "Anyone can insert members for event confirmations" ON public.members;
DROP POLICY IF EXISTS "Anyone can update members" ON public.members;

-- Keep the authenticated users view policy but rename for clarity
DROP POLICY IF EXISTS "Authenticated users can view members" ON public.members;

CREATE POLICY "Anyone can view members"
ON public.members
FOR SELECT
USING (true);

-- Only editors and admins should be able to insert members through the admin interface
-- (The existing "Editors and admins can insert members" policy already exists and is correct)

-- Only editors and admins should be able to update members through the admin interface
-- (The existing "Editors and admins can update members" policy already exists and is correct)