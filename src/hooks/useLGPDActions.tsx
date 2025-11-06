import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const useLGPDActions = () => {
  const [loading, setLoading] = useState(false);

  const exportUserData = async (userId: string) => {
    setLoading(true);
    try {
      // Buscar todos os dados do usuário
      const [profileData, confirmationsData, consentLogsData] = await Promise.all([
        supabase.from('profiles').select('*').eq('user_id', userId).single(),
        supabase.from('event_confirmations').select('*').eq('user_id', userId),
        supabase.from('consent_logs').select('*').eq('user_id', userId),
      ]);

      const userData = {
        profile: profileData.data,
        event_confirmations: confirmationsData.data,
        consent_logs: consentLogsData.data,
        export_date: new Date().toISOString(),
      };

      // Criar arquivo JSON para download
      const dataStr = JSON.stringify(userData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `meus-dados-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Dados exportados com sucesso",
        description: "Seus dados foram baixados em formato JSON.",
      });
    } catch (error) {
      toast({
        title: "Erro ao exportar dados",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteUserAccount = async (userId: string) => {
    setLoading(true);
    try {
      // Call secure edge function to delete user account
      const { error } = await supabase.functions.invoke('delete-user-account', {
        method: 'POST'
      });
      
      if (error) throw error;

      toast({
        title: "Conta excluída com sucesso",
        description: "Todos os seus dados foram removidos permanentemente.",
      });

      // Fazer logout
      await supabase.auth.signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Error deleting account:', error);
      toast({
        title: "Erro ao excluir conta",
        description: "Não foi possível excluir sua conta. Entre em contato com o suporte.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    exportUserData,
    deleteUserAccount,
    loading,
  };
};
