import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface UserMinistry {
  id: string;
  ministry_id: string;
  ministry_name: string;
  role: string | null;
  joined_at: string | null;
}

export const useUserMinistries = () => {
  const [ministries, setMinistries] = useState<UserMinistry[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUserMinistries = async () => {
      if (!user?.id) {
        setMinistries([]);
        setLoading(false);
        return;
      }

      try {
        // Primeiro, buscar o member_id do usuário
        const { data: memberData, error: memberError } = await supabase
          .from("members")
          .select("id")
          .eq("user_id", user.id)
          .maybeSingle();

        if (memberError) {
          console.error("Erro ao buscar membro:", memberError);
          setMinistries([]);
          setLoading(false);
          return;
        }

        if (!memberData) {
          // Usuário não tem um registro de membro
          setMinistries([]);
          setLoading(false);
          return;
        }

        // Buscar os ministérios do membro
        const { data: ministryMembersData, error: ministryError } = await supabase
          .from("ministry_members")
          .select(`
            id,
            ministry_id,
            role,
            joined_at,
            ministries (
              name
            )
          `)
          .eq("member_id", memberData.id);

        if (ministryError) {
          console.error("Erro ao buscar ministérios:", ministryError);
          setMinistries([]);
          setLoading(false);
          return;
        }

        const formattedMinistries: UserMinistry[] = (ministryMembersData || []).map((mm: any) => ({
          id: mm.id,
          ministry_id: mm.ministry_id,
          ministry_name: mm.ministries?.name || "Ministério desconhecido",
          role: mm.role,
          joined_at: mm.joined_at,
        }));

        setMinistries(formattedMinistries);
      } catch (error) {
        console.error("Erro ao buscar ministérios do usuário:", error);
        setMinistries([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserMinistries();
  }, [user?.id]);

  return { ministries, loading };
};
