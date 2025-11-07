import { createContext, useContext, useEffect, useState, useCallback } from 'react';
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

// Auto-logout após 30 minutos de inatividade
const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutos em milissegundos
const LAST_ACTIVITY_KEY = 'lastActivityTime';

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

  // Atualiza timestamp da última atividade
  const updateLastActivity = useCallback(() => {
    if (user) {
      localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
    }
  }, [user]);

  // Verifica se deve fazer logout por inatividade
  const checkInactivity = useCallback(async () => {
    if (!user) return;

    const lastActivity = localStorage.getItem(LAST_ACTIVITY_KEY);
    if (!lastActivity) {
      updateLastActivity();
      return;
    }

    const timeSinceLastActivity = Date.now() - parseInt(lastActivity, 10);
    
    if (timeSinceLastActivity > INACTIVITY_TIMEOUT) {
      console.log('Auto-logout: usuário inativo por muito tempo');
      await supabase.auth.signOut();
      localStorage.removeItem(LAST_ACTIVITY_KEY);
    }
  }, [user, updateLastActivity]);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Atualiza timestamp quando usuário faz login
        if (event === 'SIGNED_IN' && session) {
          localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
        }
        
        // Remove timestamp quando usuário faz logout
        if (event === 'SIGNED_OUT') {
          localStorage.removeItem(LAST_ACTIVITY_KEY);
        }
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

  // Sistema de rastreamento de atividade e auto-logout
  useEffect(() => {
    if (!user) return;

    // Verifica inatividade na inicialização
    checkInactivity();

    // Eventos de atividade do usuário
    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    
    const handleActivity = () => {
      updateLastActivity();
    };

    // Adiciona listeners de atividade
    activityEvents.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    // Verifica inatividade a cada minuto
    const inactivityInterval = setInterval(() => {
      checkInactivity();
    }, 60000); // 1 minuto

    return () => {
      // Remove listeners
      activityEvents.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
      clearInterval(inactivityInterval);
    };
  }, [user, checkInactivity, updateLastActivity]);

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
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    // Após login por email, sincroniza o email no perfil para habilitar login por telefone futuramente
    try {
      if (!error) {
        const { data: userRes } = await supabase.auth.getUser();
        const u = userRes?.user;
        if (u?.id && u.email) {
          await supabase
            .from('profiles')
            .update({ email: u.email })
            .eq('user_id', u.id);
        }
      }
    } catch {}

    return { error };
  };
  const signInWithEmailOrPhone = async (emailOrPhone: string, password: string) => {
    // Verifica se é email
    if (emailOrPhone.includes('@') && emailOrPhone.includes('.')) {
      return await signIn(emailOrPhone, password);
    }
    
    // Se não é email, trata como telefone - busca o email correspondente no profiles
    try {
      const cleanPhone = emailOrPhone.replace(/\D/g, ''); // remove (, ), espaços e -

      // Busca o perfil pelo telefone normalizado
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('user_id, email')
        .eq('phone', cleanPhone)
        .maybeSingle();

      if (profileError || !profile) {
        return { error: { message: "Usuário não encontrado com este telefone" } };
      }

      if (!profile.email) {
        return { error: { message: "Telefone localizado, mas sem email vinculado. Entre uma vez com seu email e senha para ativar o login por telefone." } };
      }

      // Faz login com o email encontrado
      return await signIn(profile.email, password);
      
    } catch (error) {
      return { error: { message: "Erro ao processar login com telefone" } };
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