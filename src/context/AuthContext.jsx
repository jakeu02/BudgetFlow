import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) {
      console.error('Failed to fetch profile:', error);
      setProfile(null);
      return null;
    }
    setProfile(data);
    return data;
  };

  useEffect(() => {
    // Safety timeout: prevent infinite loading if getSession() hangs
    // (can happen with navigator.locks after HMR/hot reload)
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 5000);

    supabase.auth.getSession().then(({ data: { session } }) => {
      clearTimeout(timeout);
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setLoading(false);
    }).catch((err) => {
      clearTimeout(timeout);
      console.error('Failed to get session:', err);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'TOKEN_REFRESHED') return;

      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        try {
          const profileData = await fetchProfile(session.user.id);
          // Auto-create profile for first-time OAuth users
          if (!profileData && event === 'SIGNED_IN') {
            const meta = session.user.user_metadata;
            await supabase.from('profiles').upsert({
              id: session.user.id,
              full_name: meta?.full_name || meta?.name || null,
              age: null,
              occupation: null,
            });
            await fetchProfile(session.user.id);
          }
        } catch (err) {
          console.error('Auth state change error:', err);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, []);

  // Inactivity auto-logout (30 minutes)
  useEffect(() => {
    if (!user) return;

    let timeoutId;
    let lastActivity = Date.now();

    const resetTimer = () => {
      const now = Date.now();
      // Throttle: only reset if 5+ seconds since last reset
      if (now - lastActivity < 5000) return;
      lastActivity = now;
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        supabase.auth.signOut();
        setProfile(null);
      }, INACTIVITY_TIMEOUT);
    };

    const events = ['keydown', 'click', 'touchstart'];
    events.forEach((event) => window.addEventListener(event, resetTimer, { passive: true }));
    resetTimer();

    return () => {
      clearTimeout(timeoutId);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [user]);

  const signUp = async (email, password, { fullName, age, occupation } = {}) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return { data, error };

    if (data.user) {
      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id,
        full_name: fullName,
        age: age ? parseInt(age, 10) : null,
        occupation: occupation || null,
      });
      if (profileError) {
        console.error('Failed to create profile:', profileError);
        return { data, error: profileError };
      }
    }

    return { data, error };
  };

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { data, error };
  };

  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    setProfile(null);
    return { error };
  };

  const updateProfile = async (updates) => {
    if (!user) return { error: new Error('Not authenticated') };
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();
    if (!error && data) setProfile(data);
    return { data, error };
  };

  return (
    <AuthContext.Provider value={{ user, session, profile, loading, signUp, signIn, signInWithGoogle, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
