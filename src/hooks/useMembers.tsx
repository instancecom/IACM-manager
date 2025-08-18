import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Member {
  id: string;
  first_name: string;
  last_name: string;
  whatsapp: string;
  birth_date: string;
  photo_url?: string;
  created_at: string;
  ministry?: {
    name: string;
    role: string;
  } | null;
}

export const useMembers = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('members')
        .select(`
          id,
          first_name,
          last_name,
          whatsapp,
          birth_date,
          photo_url,
          created_at,
          ministry_members (
            role,
            ministries (
              name
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (fetchError) {
        setError(fetchError.message);
        return;
      }

      const formattedMembers = data?.map(member => ({
        ...member,
        ministry: member.ministry_members?.[0] ? {
          name: member.ministry_members[0].ministries?.name || '',
          role: member.ministry_members[0].role || ''
        } : null
      })) || [];

      setMembers(formattedMembers);
    } catch (err) {
      setError('Erro inesperado ao carregar membros');
      console.error('Error fetching members:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  return {
    members,
    loading,
    error,
    refetch: fetchMembers
  };
};