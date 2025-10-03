-- Create enum for app roles
CREATE TYPE public.app_role AS ENUM ('admin', 'editor', 'reader', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    assigned_by UUID REFERENCES auth.users(id),
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(_user_id, 'admin'::app_role)
$$;

-- Create function to check if user is editor or admin
CREATE OR REPLACE FUNCTION public.can_edit(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(_user_id, 'admin'::app_role) OR public.has_role(_user_id, 'editor'::app_role)
$$;

-- RLS Policies for user_roles table
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid() OR public.is_admin(auth.uid()));

CREATE POLICY "Only admins can assign roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can update roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can delete roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (public.is_admin(auth.uid()));

-- Update trigger to assign "user" role to new users
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user'::app_role);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_role
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();

-- Assign admin role to the specified emails
DO $$
DECLARE
  admin_user_id UUID;
BEGIN
  -- First admin email
  SELECT id INTO admin_user_id FROM auth.users WHERE email = 'maugusto948@gmail.com';
  IF admin_user_id IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (admin_user_id, 'admin'::app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;

  -- Second admin email
  SELECT id INTO admin_user_id FROM auth.users WHERE email = 'instance.com@gmail.com';
  IF admin_user_id IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (admin_user_id, 'admin'::app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
END $$;

-- Update RLS policies for events (editors can create/edit)
DROP POLICY IF EXISTS "Authenticated users can insert events" ON public.events;
DROP POLICY IF EXISTS "Authenticated users can update events" ON public.events;
DROP POLICY IF EXISTS "Authenticated users can delete events" ON public.events;

CREATE POLICY "Editors and admins can insert events"
ON public.events
FOR INSERT
TO authenticated
WITH CHECK (public.can_edit(auth.uid()));

CREATE POLICY "Editors and admins can update events"
ON public.events
FOR UPDATE
TO authenticated
USING (public.can_edit(auth.uid()));

CREATE POLICY "Editors and admins can delete events"
ON public.events
FOR DELETE
TO authenticated
USING (public.can_edit(auth.uid()));

-- Update RLS policies for schedules (editors can create/edit)
DROP POLICY IF EXISTS "Authenticated users can manage schedules" ON public.schedules;
DROP POLICY IF EXISTS "Anyone can view schedules" ON public.schedules;

CREATE POLICY "Anyone can view schedules"
ON public.schedules
FOR SELECT
USING (true);

CREATE POLICY "Editors and admins can insert schedules"
ON public.schedules
FOR INSERT
TO authenticated
WITH CHECK (public.can_edit(auth.uid()));

CREATE POLICY "Editors and admins can update schedules"
ON public.schedules
FOR UPDATE
TO authenticated
USING (public.can_edit(auth.uid()));

CREATE POLICY "Editors and admins can delete schedules"
ON public.schedules
FOR DELETE
TO authenticated
USING (public.can_edit(auth.uid()));

-- Update RLS policies for members (editors can create/edit)
DROP POLICY IF EXISTS "Authenticated users can insert members" ON public.members;
DROP POLICY IF EXISTS "Authenticated users can update members" ON public.members;
DROP POLICY IF EXISTS "Authenticated users can delete members" ON public.members;
DROP POLICY IF EXISTS "Authenticated users can view members" ON public.members;

CREATE POLICY "Authenticated users can view members"
ON public.members
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Editors and admins can insert members"
ON public.members
FOR INSERT
TO authenticated
WITH CHECK (public.can_edit(auth.uid()));

CREATE POLICY "Editors and admins can update members"
ON public.members
FOR UPDATE
TO authenticated
USING (public.can_edit(auth.uid()));

CREATE POLICY "Editors and admins can delete members"
ON public.members
FOR DELETE
TO authenticated
USING (public.can_edit(auth.uid()));

-- Update RLS policies for ministries (editors can manage)
DROP POLICY IF EXISTS "Authenticated users can manage ministries" ON public.ministries;

CREATE POLICY "Editors and admins can insert ministries"
ON public.ministries
FOR INSERT
TO authenticated
WITH CHECK (public.can_edit(auth.uid()));

CREATE POLICY "Editors and admins can update ministries"
ON public.ministries
FOR UPDATE
TO authenticated
USING (public.can_edit(auth.uid()));

CREATE POLICY "Editors and admins can delete ministries"
ON public.ministries
FOR DELETE
TO authenticated
USING (public.can_edit(auth.uid()));

-- Update RLS policies for ministry_members (editors can manage)
DROP POLICY IF EXISTS "Authenticated users can manage ministry members" ON public.ministry_members;

CREATE POLICY "Editors and admins can insert ministry members"
ON public.ministry_members
FOR INSERT
TO authenticated
WITH CHECK (public.can_edit(auth.uid()));

CREATE POLICY "Editors and admins can update ministry members"
ON public.ministry_members
FOR UPDATE
TO authenticated
USING (public.can_edit(auth.uid()));

CREATE POLICY "Editors and admins can delete ministry members"
ON public.ministry_members
FOR DELETE
TO authenticated
USING (public.can_edit(auth.uid()));

-- Update RLS policies for banners (editors can manage)
DROP POLICY IF EXISTS "Authenticated users can manage banners" ON public.banners;

CREATE POLICY "Editors and admins can insert banners"
ON public.banners
FOR INSERT
TO authenticated
WITH CHECK (public.can_edit(auth.uid()));

CREATE POLICY "Editors and admins can update banners"
ON public.banners
FOR UPDATE
TO authenticated
USING (public.can_edit(auth.uid()));

CREATE POLICY "Editors and admins can delete banners"
ON public.banners
FOR DELETE
TO authenticated
USING (public.can_edit(auth.uid()));