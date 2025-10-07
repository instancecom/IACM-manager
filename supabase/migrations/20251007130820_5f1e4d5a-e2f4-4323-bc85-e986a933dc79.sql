-- Modificar a tabela event_confirmations para guardar os dados do formulário
-- Tornar member_id opcional (nullable)
ALTER TABLE public.event_confirmations 
ALTER COLUMN member_id DROP NOT NULL;

-- Adicionar campos do formulário
ALTER TABLE public.event_confirmations
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS responsible_name text,
ADD COLUMN IF NOT EXISTS participant_name text,
ADD COLUMN IF NOT EXISTS whatsapp text,
ADD COLUMN IF NOT EXISTS guests text[]; -- Array de convidados

-- Adicionar índice para melhor performance
CREATE INDEX IF NOT EXISTS idx_event_confirmations_user_id ON public.event_confirmations(user_id);

-- Comentários para documentação
COMMENT ON COLUMN public.event_confirmations.user_id IS 'ID do usuário logado que fez a confirmação (se aplicável)';
COMMENT ON COLUMN public.event_confirmations.responsible_name IS 'Nome do responsável pela confirmação';
COMMENT ON COLUMN public.event_confirmations.participant_name IS 'Nome do participante do evento';
COMMENT ON COLUMN public.event_confirmations.whatsapp IS 'WhatsApp para contato';
COMMENT ON COLUMN public.event_confirmations.guests IS 'Lista de nomes dos convidados';