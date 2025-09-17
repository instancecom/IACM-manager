-- Add email field to profiles table to enable WhatsApp login
ALTER TABLE public.profiles ADD COLUMN email TEXT;

-- Update existing profiles with email from auth.users
-- Note: This needs to be done via trigger since we can't directly access auth.users

-- Create a function to update profile email when user is created
CREATE OR REPLACE FUNCTION public.update_profile_email()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the profile with the user's email
  UPDATE public.profiles 
  SET email = NEW.email 
  WHERE user_id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to update profile email when user email changes
CREATE TRIGGER on_auth_user_email_updated
  AFTER UPDATE OF email ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.update_profile_email();

-- Also update the existing trigger to include email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
    INSERT INTO public.profiles (user_id, first_name, last_name, phone, email)
    VALUES (
        NEW.id,
        NEW.raw_user_meta_data->>'first_name',
        NEW.raw_user_meta_data->>'last_name',
        NEW.phone,
        NEW.email
    );
    RETURN NEW;
END;
$$;