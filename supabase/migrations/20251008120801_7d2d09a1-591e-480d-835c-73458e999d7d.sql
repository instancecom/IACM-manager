-- Adicionar campo de consentimento na tabela profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS privacy_consent_given_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS terms_accepted_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS data_processing_consent boolean DEFAULT false;

-- Criar tabela de log de consentimentos para auditoria LGPD
CREATE TABLE IF NOT EXISTS public.consent_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  consent_type text NOT NULL,
  consent_given boolean NOT NULL,
  ip_address text,
  user_agent text,
  created_at timestamp with time zone DEFAULT now()
);

-- Habilitar RLS na tabela consent_logs
ALTER TABLE public.consent_logs ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para consent_logs
CREATE POLICY "Users can view their own consent logs"
ON public.consent_logs
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own consent logs"
ON public.consent_logs
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Comentários para documentação
COMMENT ON TABLE public.consent_logs IS 'Registro de consentimentos do usuário para conformidade com LGPD';
COMMENT ON COLUMN public.profiles.privacy_consent_given_at IS 'Data e hora do consentimento de política de privacidade';
COMMENT ON COLUMN public.profiles.terms_accepted_at IS 'Data e hora da aceitação dos termos de uso';
COMMENT ON COLUMN public.profiles.data_processing_consent IS 'Consentimento para processamento de dados pessoais';