-- Add paid column to event_confirmations table
ALTER TABLE public.event_confirmations 
ADD COLUMN paid boolean DEFAULT false;

COMMENT ON COLUMN public.event_confirmations.paid IS 'Indica se o participante já realizou o pagamento';