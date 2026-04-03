import { createContext, useContext, useState, useEffect } from 'react';
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
      .maybeSingle();
    if (error) {
      console.error('Failed to fetch profile:', error);
      setProfile(null);
      return null;
    }
    setProfile(data);
    return data;
  };

  useEffect(() => {
    const timeout = setTimeout(() => { setLoading(false); }, 10000);

    const init = async () => {
      try {
        // Check if OAuth hash was captured by index.html inline script
        const storedHash = sessionStorage.getItem('sb_oauth_hash');
        if (storedHash) {
          sessionStorage.removeItem('sb_oauth_hash');
          const params = new URLSearchParams(storedHash);
          const accessToken = params.get('access_token');
          const refreshToken = params.get('refresh_token');
          if (accessToken && refreshToken) {
            const { data, error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });
            if (!error && data.session) {
              clearTimeout(timeout);
              setSession(data.session);
              setUser(data.session.user);
              const profileData = await fetchProfile(data.session.user.id);
              if (!profileData) {
                const meta = data.session.user.user_metadata;
                const autoName = meta?.full_name || meta?.name || data.session.user.email?.split('@')[0] || 'User';
                await supabase.from('profiles').upsert({
                  id: data.session.user.id,
                  full_name: autoName,
                  age: null,
                  occupation: null,
                });
                const saved = await fetchProfile(data.session.user.id);
                if (!saved) {
                  setProfile({ id: data.session.user.id, full_name: autoName, age: null, occupation: null });
                }
              }
              setLoading(false);
              return;
            }
          }
        }

        // Normal: check existing session
        const { data: { session } } = await supabase.auth.getSession();
        clearTimeout(timeout);
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          const profileData = await fetchProfile(session.user.id);
          if (!profileData) {
            // Auto-create profile from user metadata
            const meta = session.user.user_metadata;
            const autoName = meta?.full_name || meta?.name || session.user.email?.split('@')[0] || 'User';
            await supabase.from('profiles').upsert({
              id: session.user.id,
              full_name: autoName,
              age: null,
              occupation: null,
            });
            const saved = await fetchProfile(session.user.id);
            if (!saved) {
              // DB read failed (RLS issue) — set profile locally so user isn't blocked
              setProfile({ id: session.user.id, full_name: autoName, age: null, occupation: null });
            }
          }
        }
        setLoading(false);
      } catch (err) {
        clearTimeout(timeout);
        console.error('Auth init error:', err);
        setLoading(false);
      }
    };

    // Auth state change listener for sign in/out during the session
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') return;

      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        try {
          const profileData = await fetchProfile(session.user.id);
          if (!profileData && event === 'SIGNED_IN') {
            const meta = session.user.user_metadata;
            const autoName = meta?.full_name || meta?.name || session.user.email?.split('@')[0] || 'User';
            await supabase.from('profiles').upsert({
              id: session.user.id,
              full_name: autoName,
              age: null,
              occupation: null,
            });
            const saved = await fetchProfile(session.user.id);
            if (!saved) {
              setProfile({ id: session.user.id, full_name: autoName, age: null, occupation: null });
            }
          }
        } catch (err) {
          console.error('Auth state change error:', err);
        }
      } else {
        setProfile(null);
      }
    });

    init();

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
        redirectTo: window.location.origin + import.meta.env.BASE_URL,
      },
    });
    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setProfile(null);
    return { error };
  };

  const updateProfile = async (updates) => {
    if (!user) return { error: new Error('Not authenticated') };

    // Update local state immediately (optimistic)
    const updatedProfile = { ...profile, id: user.id, ...updates };
    setProfile(updatedProfile);

    // Save to DB in background
    const { error } = await supabase
      .from('profiles')
      .upsert({ id: user.id, ...updates });

    return { data: updatedProfile, error };
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
