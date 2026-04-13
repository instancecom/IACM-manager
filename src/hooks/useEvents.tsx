import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Event {
  id: string;
  title: string;
  description: string;
  address: string;
  start_date: string;
  start_time: string | null;
  end_date: string;
  end_time: string | null;
  banner_url?: string;
  categories?: string[];
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

      // Buscar contagem de pessoas confirmadas usando função segura (sem expor PII)
      const eventsWithConfirmations = await Promise.all(
        (eventsData || []).map(async (event) => {
          const { data: count } = await supabase
            .rpc('get_event_confirmation_count', { _event_id: event.id });

          return {
            ...event,
            confirmations_count: count || 0
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
      // Garantir que strings vazias sejam convertidas para null para os campos de hora
      const cleanedUpdates = { ...updates };
      if (cleanedUpdates.start_time === "") cleanedUpdates.start_time = null;
      if (cleanedUpdates.end_time === "") cleanedUpdates.end_time = null;

      const { error } = await supabase
        .from('events')
        .update(cleanedUpdates as any)
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