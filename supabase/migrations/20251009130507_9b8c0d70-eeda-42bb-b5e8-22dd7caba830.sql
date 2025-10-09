-- Add payment details columns to event_confirmations
ALTER TABLE public.event_confirmations 
ADD COLUMN IF NOT EXISTS payment_type text,
ADD COLUMN IF NOT EXISTS payment_date date,
ADD COLUMN IF NOT EXISTS payment_amount numeric(10,2);

COMMENT ON COLUMN public.event_confirmations.payment_type IS 'Tipo de pagamento: dinheiro, pix, cartão';
COMMENT ON COLUMN public.event_confirmations.payment_date IS 'Data em que o pagamento foi realizado';
COMMENT ON COLUMN public.event_confirmations.payment_amount IS 'Valor pago pelo participante';