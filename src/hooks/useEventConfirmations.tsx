import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface EventConfirmation {
  id: string;
  event_id: string;
  member_id: string;
  confirmed: boolean;
  confirmed_at: string | null;
  created_at: string;
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
      
      // Primeiro, vamos verificar se existe um membro com esse WhatsApp ou criar um novo
      let memberId: string;
      
      // Procura por um membro existente com esse WhatsApp
      const { data: existingMember } = await supabase
        .from('members')
        .select('id, user_id')
        .eq('whatsapp', confirmationData.whatsapp.replace(/\D/g, ''))
        .single();

      if (existingMember) {
        memberId = existingMember.id;
        
        // Se o usuário está logado e o membro ainda não tem user_id, associa
        if (confirmationData.userId && !existingMember.user_id) {
          await supabase
            .from('members')
            .update({ user_id: confirmationData.userId })
            .eq('id', memberId);
        }
      } else {
        // Cria um novo membro
        const { data: newMember, error: memberError } = await supabase
          .from('members')
          .insert({
            first_name: confirmationData.participantName.split(' ')[0] || confirmationData.participantName,
            last_name: confirmationData.participantName.split(' ').slice(1).join(' ') || '',
            whatsapp: confirmationData.whatsapp.replace(/\D/g, ''),
            birth_date: '2000-01-01', // Data padrão - pode ser ajustada depois
            user_id: confirmationData.userId || null // Associa ao usuário se estiver logado
          })
          .select()
          .single();

        if (memberError) {
          throw memberError;
        }

        memberId = newMember.id;
      }

      // Verifica se já existe uma confirmação para este evento e membro
      const { data: existingConfirmation } = await supabase
        .from('event_confirmations')
        .select('id')
        .eq('event_id', eventId)
        .eq('member_id', memberId)
        .single();

      if (existingConfirmation) {
        // Atualiza a confirmação existente
        const { error: updateError } = await supabase
          .from('event_confirmations')
          .update({
            confirmed: true,
            confirmed_at: new Date().toISOString()
          })
          .eq('id', existingConfirmation.id);

        if (updateError) {
          throw updateError;
        }
      } else {
        // Cria uma nova confirmação
        const { error: confirmationError } = await supabase
          .from('event_confirmations')
          .insert({
            event_id: eventId,
            member_id: memberId,
            confirmed: true,
            confirmed_at: new Date().toISOString()
          });

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

  const checkConfirmation = async (eventId: string, memberId: string) => {
    try {
      const { data, error } = await supabase
        .from('event_confirmations')
        .select('*')
        .eq('event_id', eventId)
        .eq('member_id', memberId)
        .eq('confirmed', true)
        .single();

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

  return {
    confirmations,
    loading,
    error,
    fetchConfirmations,
    confirmPresence,
    checkConfirmation,
  };
};