import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, metadata?: { first_name?: string; last_name?: string; phone?: string }) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signInWithEmailOrPhone: (emailOrPhone: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, metadata?: { first_name?: string; last_name?: string; phone?: string }) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: metadata
      }
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signInWithEmailOrPhone = async (emailOrPhone: string, password: string) => {
    // Verifica se é email
    if (emailOrPhone.includes('@') && emailOrPhone.includes('.')) {
      return await signIn(emailOrPhone, password);
    }
    
    // Se não é email, trata como WhatsApp - busca o email correspondente
    try {
      const cleanPhone = emailOrPhone.replace(/\D/g, '');
      
      // Busca membro pelo WhatsApp
      const { data: member, error: memberError } = await supabase
        .from('members')
        .select('user_id, profiles!inner(user_id)')
        .eq('whatsapp', emailOrPhone)
        .maybeSingle();

      if (memberError || !member) {
        return { error: { message: "Usuário não encontrado com este WhatsApp" } };
      }

      // Busca o email do usuário no profiles
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('user_id')
        .eq('user_id', member.user_id)
        .maybeSingle();

      if (profileError || !profile) {
        return { error: { message: "Perfil de usuário não encontrado" } };
      }

      // Busca o email na tabela auth.users via uma edge function ou direto pelo user_id
      // Como não podemos acessar auth.users diretamente, vamos usar outra abordagem
      // Vamos salvar o email no profiles quando o usuário se registra
      return { error: { message: "Sistema de login por WhatsApp precisa ser configurado. Use seu email para entrar." } };
      
    } catch (error) {
      return { error: { message: "Erro ao processar login com WhatsApp" } };
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signInWithEmailOrPhone,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};