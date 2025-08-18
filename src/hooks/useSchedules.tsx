import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useSchedules = () => {
  return useQuery({
    queryKey: ["schedules"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("schedules")
        .select(`
          *,
          members (
            first_name,
            last_name,
            whatsapp,
            photo_url
          )
        `)
        .order("date", { ascending: true });

      if (error) {
        console.error("Error fetching schedules:", error);
        throw error;
      }

      return data || [];
    },
  });
};