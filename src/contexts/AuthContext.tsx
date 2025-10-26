import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface MockUser {
  id: string;
  email: string;
  created_at: string;
}

interface MockProfile {
  id: string;
  user_id: string;
  username?: string;
  display_name?: string;
  avatar_url?: string;
  wallet_address?: string;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: MockUser | null;
  session: any;
  profile: MockProfile | null;
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
  const [user, setUser] = useState<MockUser | null>(null);
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<MockProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const isWalletConnected = !!(profile?.wallet_address);

  useEffect(() => {
    // Check for existing session
    const initializeAuth = async () => {
      const savedSession = localStorage.getItem('mock_session');
      if (savedSession) {
        try {
          const sessionData = JSON.parse(savedSession);
          setUser(sessionData.user);
          setSession(sessionData.session);
          setProfile(sessionData.profile);
        } catch (error) {
          console.error('Error parsing saved session:', error);
          localStorage.removeItem('mock_session');
        }
      }
      setLoading(false);
    };
    
    initializeAuth();
  }, []);

  const connectWallet = async () => {
    try {
      setLoading(true);
      
      // Check if Phantom is installed
      const isPhantomInstalled = typeof window !== 'undefined' && window.solana && window.solana.isPhantom;
      
      if (!isPhantomInstalled) {
        throw new Error('Phantom wallet is not installed');
      }

      // Simulate wallet connection delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // For demo purposes, use mock wallet address
      const mockWalletAddress = MOCK_WALLETS[Math.floor(Math.random() * MOCK_WALLETS.length)];
      const displayName = generateMockDisplayName();
      
      // Generate a proper UUID v4 format for mock user
      const userId = crypto.randomUUID();
      
      const mockUser: MockUser = {
        id: userId,
        email: `${mockWalletAddress.slice(0, 8)}@solana.wallet`,
        created_at: new Date().toISOString(),
      };

      const mockSession = {
        access_token: `mock-token-${Date.now()}`,
        token_type: 'bearer',
        user: mockUser,
      };

      const mockProfile: MockProfile = {
        id: `profile-${userId}`,
        user_id: userId,
        username: mockWalletAddress.slice(0, 8),
        display_name: displayName,
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${mockWalletAddress}`,
        wallet_address: mockWalletAddress,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Save profile to Supabase database
      console.log('Saving wallet profile to database:', {
        user_id: userId,
        username: mockWalletAddress.slice(0, 8),
        display_name: displayName,
        wallet_address: mockWalletAddress,
      });
      
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .upsert({
          user_id: userId,
          username: mockWalletAddress.slice(0, 8),
          display_name: displayName,
          avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${mockWalletAddress}`,
          wallet_address: mockWalletAddress
        })
        .select();

      if (profileError) {
        console.error('Error saving profile to database:', profileError);
      } else {
        console.log('Profile saved to database successfully:', profileData);
      }

      // Save to localStorage
      const sessionData = {
        user: mockUser,
        session: mockSession,
        profile: mockProfile,
      };
      localStorage.setItem('mock_session', JSON.stringify(sessionData));

      setUser(mockUser);
      setSession(mockSession);
      setProfile(mockProfile);
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      localStorage.removeItem('mock_session');
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