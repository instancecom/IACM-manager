import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface EventConfirmation {
  id: string;
  event_id: string;
  user_id: string | null;
  responsible_name: string | null;
  participant_name: string | null;
  whatsapp: string | null;
  guests: string[] | null;
  confirmed: boolean;
  confirmed_at: string | null;
  created_at: string;
  member_id: string | null; // Mantido por compatibilidade com dados antigos
  paid: boolean;
}

export interface ConfirmationData {
  responsibleName: string;
  participantName: string;
  whatsapp: string;
  guests: string[];
  userId?: string; // ID do usuário logado (opcional)
}

export const useEventConfirmations = () => {
  const [confirmations, setConfirmations] = useState<EventConfirmation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchConfirmations = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('event_confirmations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        setError(error.message);
        toast({
          title: "Erro ao carregar confirmações",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setConfirmations(data || []);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro inesperado";
      setError(errorMessage);
      toast({
        title: "Erro inesperado",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const confirmPresence = async (eventId: string, confirmationData: ConfirmationData) => {
    try {
      setLoading(true);
      
      // Verifica se já existe uma confirmação para este evento e usuário/whatsapp
      let existingConfirmation = null;
      
      if (confirmationData.userId) {
        // Se o usuário está logado, busca por user_id
        const { data } = await supabase
          .from('event_confirmations')
          .select('id')
          .eq('event_id', eventId)
          .eq('user_id', confirmationData.userId)
          .maybeSingle();
        
        existingConfirmation = data;
      } else {
        // Se não está logado, busca por whatsapp
        const { data } = await supabase
          .from('event_confirmations')
          .select('id')
          .eq('event_id', eventId)
          .eq('whatsapp', confirmationData.whatsapp.replace(/\D/g, ''))
          .maybeSingle();
        
        existingConfirmation = data;
      }

      const confirmationPayload = {
        event_id: eventId,
        user_id: confirmationData.userId || null,
        responsible_name: confirmationData.responsibleName,
        participant_name: confirmationData.participantName,
        whatsapp: confirmationData.whatsapp.replace(/\D/g, ''),
        guests: confirmationData.guests.filter(g => g.trim() !== ''), // Remove guests vazios
        confirmed: true,
        confirmed_at: new Date().toISOString(),
        member_id: null // Não usamos mais member_id
      };

      if (existingConfirmation) {
        // Atualiza a confirmação existente
        const { error: updateError } = await supabase
          .from('event_confirmations')
          .update(confirmationPayload)
          .eq('id', existingConfirmation.id);

        if (updateError) {
          throw updateError;
        }
      } else {
        // Cria uma nova confirmação
        const { error: confirmationError } = await supabase
          .from('event_confirmations')
          .insert(confirmationPayload);

        if (confirmationError) {
          throw confirmationError;
        }
      }

      await fetchConfirmations();
      
      toast({
        title: "Presença confirmada!",
        description: "Sua presença foi confirmada com sucesso.",
      });

      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro inesperado";
      toast({
        title: "Erro ao confirmar presença",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const checkUserConfirmation = async (eventId: string, userId: string) => {
    try {
      const { data, error } = await supabase
        .from('event_confirmations')
        .select('*')
        .eq('event_id', eventId)
        .eq('user_id', userId)
        .eq('confirmed', true)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
        throw error;
      }

      return !!data;
    } catch (error) {
      console.error('Erro ao verificar confirmação:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchConfirmations();
  }, []);

  const updatePaymentStatus = async (confirmationId: string, paid: boolean) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('event_confirmations')
        .update({ paid })
        .eq('id', confirmationId);

      if (error) {
        throw error;
      }

      await fetchConfirmations();
      
      toast({
        title: paid ? "Pagamento confirmado!" : "Pagamento desmarcado",
        description: paid ? "O pagamento foi marcado como realizado." : "O pagamento foi marcado como não realizado.",
      });

      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro inesperado";
      toast({
        title: "Erro ao atualizar status de pagamento",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    confirmations,
    loading,
    error,
    fetchConfirmations,
    confirmPresence,
    checkUserConfirmation,
    updatePaymentStatus,
  };
};