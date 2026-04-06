import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface UnifiedProfile {
  id: string;
  user_id: string | null;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  email: string | null;
  avatar_url: string | null;
  isManual: boolean;
  member_id: string;
}

export const useUnifiedProfiles = () => {
  const [profiles, setProfiles] = useState<UnifiedProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUnifiedProfiles = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Busca perfis reais (quem tem conta) via Edge Function
      const { data: profilesData, error: profilesError } = await supabase.functions.invoke('list-profiles');
      
      if (profilesError) throw new Error(profilesError.message);
      if (profilesData?.error) throw new Error(profilesData.error);

      const accountProfiles: UnifiedProfile[] = (profilesData?.profiles || []).map((p: any) => ({
        ...p,
        isManual: false,
        member_id: '' // Será preenchido se encontrarmos o membro correspondente, mas para usuários com conta focamos no user_id
      }));

      // 2. Busca membros manuais (quem NÃO tem conta)
      const { data: membersData, error: membersError } = await supabase
        .from('members')
        .select('*')
        .is('user_id', null);

      if (membersError) throw new Error(membersError.message);

      const manualMembers: UnifiedProfile[] = (membersData || []).map((m: any) => ({
        id: m.id,
        user_id: null,
        first_name: m.first_name,
        last_name: m.last_name,
        phone: m.whatsapp,
        email: null,
        avatar_url: m.photo_url,
        isManual: true,
        member_id: m.id
      }));

      // 3. Combina as listas
      // Nota: Usuários com conta que JÁ estão na tabela members serão tratados pelo fluxo normal de Alunos.
      // Aqui o objetivo é mostrar Membros que AINDA não tem conta na mesma lista.
      const combined = [...accountProfiles, ...manualMembers].sort((a, b) => 
        (a.first_name || '').localeCompare(b.first_name || '')
      );

      setProfiles(combined);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar perfis unificados');
      console.error('Error fetching unified profiles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnifiedProfiles();
  }, []);

  return {
    profiles,
    loading,
    error,
    refetch: fetchUnifiedProfiles
  };
};
