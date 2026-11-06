import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from './supabaseClient';

/**
 * @typedef {{
 *   id: string,
 *   email: string | null,
 *   user_metadata?: {
 *     full_name?: string,
 *     avatar_url?: string,
 *   }
 * }} AuthUser
 *
 * @typedef {{
 *   user: AuthUser | null,
 *   session: any,
 *   loading: boolean,
 *   signIn: (email: string, password: string) => Promise<{ data: any, error: Error | null }>,
 *   signUp: (email: string, password: string) => Promise<{ data: any, error: Error | null }>,
 *   signInWithGoogle: () => Promise<{ data: any, error: Error | null }>,
 *   signOut: () => Promise<{ error: Error | null }>
 * }} AuthContextValue
 */

/** @type {import('react').Context<AuthContextValue | null>} */
const AuthContext = createContext(null);

/**
 * @param {{ children: import('react').ReactNode }} props
 * @returns {import('react').JSX.Element}
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const initializeSession = async () => {
      try {
        const {
          data: { session: currentSession },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        if (!isMounted) {
          return;
        }

        setSession(currentSession);
        setUser(currentSession?.user ?? null);
      } catch (error) {
        setSession(null);
        setUser(null);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initializeSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!isMounted) {
        return;
      }

      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const value = useMemo(() => ({
    user,
    session,
    loading,
    signIn: async (email, password) => {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        return { data, error };
      } catch (error) {
        return {
          data: null,
          error: error instanceof Error ? error : new Error('Đăng nhập thất bại.'),
        };
      }
    },
    signUp: async (email, password) => {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
          },
        });
        return { data, error };
      } catch (error) {
        return {
          data: null,
          error: error instanceof Error ? error : new Error('Đăng ký thất bại.'),
        };
      }
    },
    signInWithGoogle: async () => {
      try {
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin,
          },
        });
        return { data, error };
      } catch (error) {
        return {
          data: null,
          error: error instanceof Error ? error : new Error('Đăng nhập Google thất bại.'),
        };
      }
    },
    signOut: async () => {
      try {
        const { error } = await supabase.auth.signOut();
        return { error };
      } catch (error) {
        return {
          error: error instanceof Error ? error : new Error('Đăng xuất thất bại.'),
        };
      }
    },
  }));

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * @returns {AuthContextValue}
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth phải được dùng trong AuthProvider');
  }

  return context;
}
