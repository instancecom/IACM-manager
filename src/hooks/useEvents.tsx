import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Event {
  id: string;
  title: string;
  description: string;
  address: string;
  start_date: string;
  start_time: string;
  end_date: string;
  end_time: string;
  banner_url?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  confirmations_count?: number;
  allow_guests?: boolean;
}

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);

    try {
      // Buscar eventos
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .order('start_date', { ascending: true });

      if (eventsError) {
        setError(eventsError.message);
        toast({
          title: "Erro ao carregar eventos",
          description: eventsError.message,
          variant: "destructive",
        });
        return;
      }

      // Buscar contagem de pessoas confirmadas para cada evento (participante + convidados)
      const eventsWithConfirmations = await Promise.all(
        (eventsData || []).map(async (event) => {
          const { data: confirmations } = await supabase
            .from('event_confirmations')
            .select('id, guests')
            .eq('event_id', event.id)
            .eq('confirmed', true);

          // Calcular total de pessoas: cada confirmação = 1 participante + número de guests
          const totalPeople = (confirmations || []).reduce((total, confirmation) => {
            const guestsCount = confirmation.guests?.length || 0;
            return total + 1 + guestsCount; // 1 (participante) + guests
          }, 0);

          return {
            ...event,
            confirmations_count: totalPeople
          };
        })
      );

      setEvents(eventsWithConfirmations);
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

  const deleteEvent = async (id: string) => {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) {
        toast({
          title: "Erro ao excluir evento",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      await fetchEvents(); // Recarrega a lista
      toast({
        title: "Evento excluído",
        description: "O evento foi removido com sucesso.",
      });
      return true;
    } catch (error) {
      toast({
        title: "Erro inesperado",
        description: "Tente novamente mais tarde",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateEvent = async (id: string, updates: Partial<Event>) => {
    try {
      const { error } = await supabase
        .from('events')
        .update(updates)
        .eq('id', id);

      if (error) {
        toast({
          title: "Erro ao atualizar evento",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      await fetchEvents(); // Recarrega a lista
      toast({
        title: "Evento atualizado",
        description: "As informações do evento foram atualizadas com sucesso.",
      });
      return true;
    } catch (error) {
      toast({
        title: "Erro inesperado",
        description: "Tente novamente mais tarde",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return {
    events,
    loading,
    error,
    fetchEvents,
    deleteEvent,
    updateEvent,
  };
};