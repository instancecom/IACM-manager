-- Adicionar política para permitir que qualquer pessoa visualize confirmações (para contagem)
CREATE POLICY "Anyone can view confirmations for counting"
ON public.event_confirmations
FOR SELECT
USING (true);