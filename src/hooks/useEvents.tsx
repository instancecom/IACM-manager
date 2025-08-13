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
}

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('start_date', { ascending: true });

      if (error) {
        setError(error.message);
        toast({
          title: "Erro ao carregar eventos",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setEvents(data || []);
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