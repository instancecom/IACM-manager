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

      // 2. Busca todos os membros para fazer o de-para de IDs
      const { data: membersData, error: membersError } = await supabase
        .from('members')
        .select('*');

      if (membersError) throw new Error(membersError.message);

      const accountProfiles: UnifiedProfile[] = (profilesData?.profiles || []).map((p: any) => {
        // Tenta encontrar o membro correspondente a este usuário para pegar o member_id
        const matchedMember = (membersData || []).find(m => m.user_id === p.user_id);
        
        return {
          ...p,
          isManual: false,
          member_id: matchedMember?.id || ''
        };
      });

      // 3. Busca membros manuais (quem NÃO tem conta) para adicionar separadamente
      const manualMembers: UnifiedProfile[] = (membersData || [])
        .filter(m => !m.user_id)
        .map((m: any) => ({
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

      // 4. Combina as listas
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
