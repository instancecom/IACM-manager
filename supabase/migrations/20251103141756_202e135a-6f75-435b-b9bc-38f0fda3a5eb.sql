-- Create table for individual payments
CREATE TABLE public.event_payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  confirmation_id UUID NOT NULL REFERENCES public.event_confirmations(id) ON DELETE CASCADE,
  payment_type TEXT NOT NULL,
  payment_date DATE NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

COMMENT ON TABLE public.event_payments IS 'Individual payments for event confirmations';
COMMENT ON COLUMN public.event_payments.confirmation_id IS 'Reference to the event confirmation';
COMMENT ON COLUMN public.event_payments.payment_type IS 'Type of payment: dinheiro, pix, or cartão';
COMMENT ON COLUMN public.event_payments.payment_date IS 'Date when the payment was made';
COMMENT ON COLUMN public.event_payments.amount IS 'Amount paid in this transaction';

-- Enable RLS
ALTER TABLE public.event_payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for event_payments
CREATE POLICY "Anyone can view payments"
  ON public.event_payments
  FOR SELECT
  USING (true);

CREATE POLICY "Editors and admins can insert payments"
  ON public.event_payments
  FOR INSERT
  WITH CHECK (can_edit(auth.uid()));

CREATE POLICY "Editors and admins can update payments"
  ON public.event_payments
  FOR UPDATE
  USING (can_edit(auth.uid()));

CREATE POLICY "Editors and admins can delete payments"
  ON public.event_payments
  FOR DELETE
  USING (can_edit(auth.uid()));

-- Rename payment_amount to total_amount in event_confirmations for clarity
ALTER TABLE public.event_confirmations 
  RENAME COLUMN payment_amount TO total_amount;

COMMENT ON COLUMN public.event_confirmations.total_amount IS 'Total amount to be paid for this event confirmation';

-- Remove old single payment fields as they are no longer needed
ALTER TABLE public.event_confirmations 
  DROP COLUMN IF EXISTS payment_type,
  DROP COLUMN IF EXISTS payment_date;

-- Create index for faster queries
CREATE INDEX idx_event_payments_confirmation_id ON public.event_payments(confirmation_id);