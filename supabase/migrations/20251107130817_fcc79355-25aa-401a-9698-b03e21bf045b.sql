-- Create a secure function to get email by phone for login purposes
CREATE OR REPLACE FUNCTION public.get_email_by_phone(phone_number text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_email text;
BEGIN
  -- Clean the phone number (remove non-digits)
  phone_number := regexp_replace(phone_number, '\D', '', 'g');
  
  -- Look up email by phone in profiles table
  SELECT email INTO user_email
  FROM public.profiles
  WHERE phone = phone_number
  LIMIT 1;
  
  RETURN user_email;
END;
$$;