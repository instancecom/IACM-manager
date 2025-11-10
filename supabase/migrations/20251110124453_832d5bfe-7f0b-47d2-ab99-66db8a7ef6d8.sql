-- Make phone lookup robust by normalizing stored phone as well
CREATE OR REPLACE FUNCTION public.get_email_by_phone(phone_number text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  user_email text;
  cleaned_input text;
BEGIN
  -- Clean the phone number (remove non-digits)
  cleaned_input := regexp_replace(phone_number, '\\D', '', 'g');
  
  -- 1) Try profiles comparing normalized phone
  SELECT email INTO user_email
  FROM public.profiles
  WHERE regexp_replace(coalesce(phone, ''), '\\D', '', 'g') = cleaned_input
  LIMIT 1;

  IF user_email IS NOT NULL THEN
    RETURN user_email;
  END IF;

  -- 2) Fallback: raw auth.users data (read-only view through security definer)
  -- Note: This select is safe under SECURITY DEFINER and does not expose PII beyond returning the matched email
  SELECT u.email INTO user_email
  FROM auth.users u
  WHERE regexp_replace(coalesce(u.phone, ''), '\\D', '', 'g') = cleaned_input
     OR regexp_replace(coalesce(u.raw_user_meta_data->>'phone',''), '\\D', '', 'g') = cleaned_input
  LIMIT 1;

  RETURN user_email; -- may be null
END;
$function$;