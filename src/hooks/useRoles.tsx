import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export type AppRole = 'admin' | 'editor' | 'reader' | 'user';

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  assigned_by?: string;
  assigned_at: string;
}

export interface UserWithRoles {
  id: string;
  email: string;
  roles: AppRole[];
  created_at: string;
}

export const useRoles = () => {
  const { user } = useAuth();
  const [userRoles, setUserRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [canEdit, setCanEdit] = useState(false);

  const fetchUserRoles = async () => {
    if (!user) {
      setUserRoles([]);
      setIsAdmin(false);
      setCanEdit(false);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);

      if (error) throw error;

      const roles = data?.map(r => r.role as AppRole) || [];
      setUserRoles(roles);
      setIsAdmin(roles.includes('admin'));
      setCanEdit(roles.includes('admin') || roles.includes('editor'));
    } catch (error) {
      console.error('Error fetching user roles:', error);
      setUserRoles([]);
      setIsAdmin(false);
      setCanEdit(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllUsersWithRoles = async () => {
    try {
      // Busca todos os usuários do auth
      const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();
      
      if (usersError) throw usersError;

      // Busca roles de todos os usuários
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      // Mapeia roles por user_id
      const rolesMap = new Map<string, AppRole[]>();
      rolesData?.forEach(r => {
        const existing = rolesMap.get(r.user_id) || [];
        rolesMap.set(r.user_id, [...existing, r.role as AppRole]);
      });

      // Combina usuários com seus roles
      const usersWithRoles: UserWithRoles[] = users.map(u => ({
        id: u.id,
        email: u.email || '',
        roles: rolesMap.get(u.id) || [],
        created_at: u.created_at
      }));

      return usersWithRoles;
    } catch (error) {
      console.error('Error fetching users with roles:', error);
      return [];
    }
  };

  const assignRole = async (userId: string, role: AppRole) => {
    if (!isAdmin) {
      throw new Error('Apenas administradores podem atribuir roles');
    }

    try {
      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role: role,
          assigned_by: user?.id
        });

      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      console.error('Error assigning role:', error);
      return { success: false, error: error.message };
    }
  };

  const removeRole = async (userId: string, role: AppRole) => {
    if (!isAdmin) {
      throw new Error('Apenas administradores podem remover roles');
    }

    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', role);

      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      console.error('Error removing role:', error);
      return { success: false, error: error.message };
    }
  };

  useEffect(() => {
    fetchUserRoles();
  }, [user]);

  return {
    userRoles,
    loading,
    isAdmin,
    canEdit,
    fetchUserRoles,
    fetchAllUsersWithRoles,
    assignRole,
    removeRole,
  };
};
