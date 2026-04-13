-- Add category column to events table
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS category TEXT;

-- Update existing events to have 'Livre' as default category if null
UPDATE public.events SET category = 'Livre' WHERE category IS NULL;
