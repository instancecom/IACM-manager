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
  const [canRead, setCanRead] = useState(false);

  const fetchUserRoles = async () => {
    if (!user) {
      setUserRoles([]);
      setIsAdmin(false);
      setCanEdit(false);
      setCanRead(false);
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
      setCanRead(roles.includes('admin') || roles.includes('editor') || roles.includes('reader'));
    } catch (error) {
      console.error('Error fetching user roles:', error);
      setUserRoles([]);
      setIsAdmin(false);
      setCanEdit(false);
      setCanRead(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllUsersWithRoles = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.error('No session found');
        return [];
      }

      const SUPABASE_URL = "https://gyzkhgtafwwzlvmpeqdk.supabase.co";
      const response = await fetch(
        `${SUPABASE_URL}/functions/v1/list-users-with-roles`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch users');
      }

      const { users } = await response.json();
      return users as UserWithRoles[];
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
    canRead,
    fetchUserRoles,
    fetchAllUsersWithRoles,
    assignRole,
    removeRole,
  };
};
