import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface Profile {
  id: string;
  wallet_address: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  total_raised: number;
  total_donated: number;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  connectWallet: () => Promise<void>;
  signOut: () => Promise<void>;
  isWalletConnected: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock Solana wallet addresses for demonstration
const MOCK_WALLETS = [
  "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
  "GrDMoeqMLFjeXQ24H56S1RLgT4R76jsuWCd6SvXyGPQ5",
  "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM",
  "HN7cABqLq46Es1jh92dQQisAq662SmxELLLsHHe4YWrH",
  "DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CNSKK",
  "5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1",
  "CuieVDEDtLo7FypA9SbLM9saXFdb1dsshEkyErMqkRQq",
  "8Kag8CqNdCLRbv7oYvTjPzqGcfZkN7zWeSLuqHYzLSXo",
  "AdH2Utn6Fus15ZhtenW4hZBQnvtLgM1YCW2MfVp7pYS5",
  "3JCjFpY1JjUhPVHWNYvdGpvEHhN2rSqmjMwVm9hm3gxY"
];

const generateMockDisplayName = () => {
  const prefixes = ["Crypto", "Solana", "DeFi", "NFT", "Web3", "Degen", "Whale", "Diamond", "Moon", "Alpha"];
  const suffixes = ["Trader", "Builder", "Collector", "Farmer", "Hunter", "Seeker", "Hands", "Enthusiast", "Legend", "Pro"];
  return `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${suffixes[Math.floor(Math.random() * suffixes.length)]}`;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const isWalletConnected = !!(profile?.wallet_address);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Fetch profile when session changes
        if (session?.user) {
          setTimeout(() => {
            supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single()
              .then(({ data }) => setProfile(data));
          }, 0);
        } else {
          setProfile(null);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data }) => {
            setProfile(data);
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const connectWallet = async () => {
    try {
      setLoading(true);
      
      // Check if Phantom is installed
      const isPhantomInstalled = typeof window !== 'undefined' && window.solana && window.solana.isPhantom;
      
      if (!isPhantomInstalled) {
        throw new Error('Phantom wallet is not installed. Please install Phantom from https://phantom.app');
      }

      // Connect to Phantom wallet
      const response = await window.solana.connect();
      const walletAddress = response.publicKey.toString();
      
      // Generate display name
      const displayName = generateMockDisplayName();
      const username = walletAddress.slice(0, 8);
      
      // Sign up with Supabase Auth
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: `${walletAddress}@phantom.wallet`,
        password: walletAddress, // Using wallet address as password
        options: {
          data: {
            wallet_address: walletAddress,
            username: username,
            display_name: displayName,
          }
        }
      });

      if (signUpError) {
        // If user already exists, sign in instead
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: `${walletAddress}@phantom.wallet`,
          password: walletAddress,
        });

        if (signInError) throw signInError;
        
        setUser(signInData.user);
        setSession(signInData.session);

        // Fetch existing profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', signInData.user.id)
          .single();

        setProfile(profileData);
      } else {
        setUser(authData.user);
        setSession(authData.session);

        // Fetch the newly created profile
        if (authData.user) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authData.user.id)
            .single();

          setProfile(profileData);
        }
      }

      // Save to localStorage for persistence
      const sessionData = {
        user: authData?.user,
        session: authData?.session,
      };
      localStorage.setItem('wallet_session', JSON.stringify(sessionData));

    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      if (window.solana) {
        await window.solana.disconnect();
      }
      localStorage.removeItem('wallet_session');
      setUser(null);
      setSession(null);
      setProfile(null);
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
      throw error;
    }
  };

  const value = {
    user,
    session,
    profile,
    loading,
    connectWallet,
    signOut,
    isWalletConnected,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Type declaration for Phantom wallet
declare global {
  interface Window {
    solana?: {
      isPhantom?: boolean;
      connect: () => Promise<{ publicKey: { toString: () => string } }>;
      disconnect: () => Promise<void>;
      on: (event: string, callback: () => void) => void;
    };
  }
}