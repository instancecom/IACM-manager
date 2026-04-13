-- Update category column to be text[] to support multiple tags
ALTER TABLE public.events 
  ALTER COLUMN category TYPE text[] 
  USING ARRAY[category];

-- Rename column for better clarity (optional, but good for consistency)
-- For now, I'll keep it as category to avoid breaking too much code at once, 
-- or I can rename it to categories.
-- Let's rename to categories.
ALTER TABLE public.events RENAME COLUMN category TO categories;

-- Update existing events to have ['Livre'] as default category if null or empty
UPDATE public.events SET categories = ARRAY['Livre'] WHERE categories IS NULL OR categories = ARRAY[NULL]::text[];
