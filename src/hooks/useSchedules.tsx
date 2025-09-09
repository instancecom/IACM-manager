import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Schedule {
  id: string;
  schedule_type: string;
  date: string;
  member_id?: string;
  external_person_name?: string;
  external_person_phone?: string;
  notes?: string;
  created_at: string;
  members?: {
    first_name: string;
    last_name: string;
    whatsapp: string;
    photo_url?: string;
  } | null;
}

export const useSchedules = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('schedules')
        .select(`
          id,
          schedule_type,
          date,
          member_id,
          external_person_name,
          external_person_phone,
          notes,
          created_at,
          members (
            first_name,
            last_name,
            whatsapp,
            photo_url
          )
        `)
        .order('date', { ascending: true });

      if (fetchError) {
        setError(fetchError.message);
        return;
      }

      setSchedules(data || []);
    } catch (err) {
      setError('Erro inesperado ao carregar escalas');
      console.error('Error fetching schedules:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  return {
    schedules,
    loading,
    error,
    refetch: fetchSchedules
  };
};