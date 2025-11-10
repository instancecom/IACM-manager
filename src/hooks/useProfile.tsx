import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

export interface UserProfile {
  id: string;
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  birth_date: string | null;
  avatar_url: string | null;
  privacy_consent_given_at: string | null;
  terms_accepted_at: string | null;
  data_processing_consent: boolean | null;
  created_at: string;
  updated_at: string;
}

export const useProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchProfile = async () => {
    if (!user?.id) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
        setError(error.message);
        toast({
          title: "Erro ao carregar perfil",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setProfile(data || null);
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

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user?.id) {
      toast({
        title: "Erro",
        description: "Usuário não autenticado",
        variant: "destructive",
      });
      return false;
    }

    setLoading(true);

    try {
      // Tratar campos de data vazios convertendo para null e limpar telefone
      const cleanedUpdates = {
        ...updates,
        birth_date: updates.birth_date === "" ? null : updates.birth_date,
        phone: updates.phone ? updates.phone.replace(/\D/g, '') : updates.phone,
      };

      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          ...cleanedUpdates,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        })
        .select()
        .single();

      if (error) {
        toast({
          title: "Erro ao atualizar perfil",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      setProfile(data);
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram salvas com sucesso.",
      });
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro inesperado";
      toast({
        title: "Erro inesperado",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getFullName = () => {
    if (!profile) return "Usuário";
    const firstName = profile.first_name || "";
    const lastName = profile.last_name || "";
    return `${firstName} ${lastName}`.trim() || "Usuário";
  };

  const getInitials = () => {
    if (!profile) return "U";
    const firstName = profile.first_name || "";
    const lastName = profile.last_name || "";
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "U";
  };

  useEffect(() => {
    fetchProfile();
  }, [user?.id]);

  return {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
    getFullName,
    getInitials,
  };
};