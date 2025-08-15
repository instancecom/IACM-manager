import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Ministry {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  members?: MinistryMember[];
}

export interface MinistryMember {
  id: string;
  member_id: string;
  ministry_id: string;
  role: string | null;
  joined_at: string;
  member: {
    id: string;
    first_name: string;
    last_name: string;
    whatsapp: string;
    birth_date: string;
    photo_url: string | null;
  };
}

export const useMinistries = () => {
  const [ministries, setMinistries] = useState<Ministry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMinistries = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('ministries')
        .select(`
          *,
          ministry_members (
            id,
            member_id,
            ministry_id,
            role,
            joined_at,
            member:members (
              id,
              first_name,
              last_name,
              whatsapp,
              birth_date,
              photo_url
            )
          )
        `)
        .order('name');

      if (error) throw error;

      const formattedData = data?.map(ministry => ({
        ...ministry,
        members: ministry.ministry_members?.map(mm => ({
          ...mm,
          member: mm.member
        }))
      })) || [];

      setMinistries(formattedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar ministérios');
    } finally {
      setLoading(false);
    }
  };

  const addMemberToMinistry = async (memberId: string, ministryId: string, role: string = 'Membro') => {
    try {
      const { error } = await supabase
        .from('ministry_members')
        .insert([
          {
            member_id: memberId,
            ministry_id: ministryId,
            role: role
          }
        ]);

      if (error) throw error;
      await fetchMinistries(); // Recarrega os dados
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erro ao adicionar membro ao ministério');
    }
  };

  const removeMemberFromMinistry = async (membershipId: string) => {
    try {
      const { error } = await supabase
        .from('ministry_members')
        .delete()
        .eq('id', membershipId);

      if (error) throw error;
      await fetchMinistries(); // Recarrega os dados
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erro ao remover membro do ministério');
    }
  };

  useEffect(() => {
    fetchMinistries();
  }, []);

  return {
    ministries,
    loading,
    error,
    fetchMinistries,
    addMemberToMinistry,
    removeMemberFromMinistry
  };
};