
-- 1. Create a SECURITY DEFINER function to count confirmations publicly (no PII exposed)
CREATE OR REPLACE FUNCTION public.get_event_confirmation_count(_event_id uuid)
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT SUM(1 + COALESCE(array_length(guests, 1), 0))::integer
     FROM public.event_confirmations
     WHERE event_id = _event_id AND confirmed = true),
    0
  )
$$;

-- 2. Drop overly permissive SELECT policies
DROP POLICY IF EXISTS "Anyone can view confirmations for counting" ON public.event_confirmations;
DROP POLICY IF EXISTS "Anyone can view members" ON public.members;
DROP POLICY IF EXISTS "Anyone can view schedules" ON public.schedules;

-- 3. Recreate policies requiring authentication
CREATE POLICY "Authenticated users can view members"
ON public.members FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Authenticated users can view schedules"
ON public.schedules FOR SELECT TO authenticated
USING (true);

-- 4. Add storage policies for logo-confirmation bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('logo-confirmation', 'logo-confirmation', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Auth users can upload logos"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'logo-confirmation');

CREATE POLICY "Logos are publicly accessible"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'logo-confirmation');

CREATE POLICY "Auth users can update logos"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'logo-confirmation');

CREATE POLICY "Auth users can delete logos"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'logo-confirmation');
