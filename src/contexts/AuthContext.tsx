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
  x_account_id?: string;
  x_username?: string;
  x_display_name?: string;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: MockUser | null;
  session: any;
  profile: MockProfile | null;
  loading: boolean;
  signInWithX: () => Promise<void>;
  signOut: () => Promise<void>;
  isXConnected: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock data for demonstration - expanded with more unique profiles
const MOCK_X_USERS = [
  { x_account_id: "123456789", x_username: "crypto_trader", x_display_name: "Crypto Trader 🚀" },
  { x_account_id: "987654321", x_username: "web3_builder", x_display_name: "Web3 Builder" },
  { x_account_id: "456789123", x_username: "defi_enthusiast", x_display_name: "DeFi Enthusiast" },
  { x_account_id: "789123456", x_username: "nft_collector", x_display_name: "NFT Collector ✨" },
  { x_account_id: "321654987", x_username: "yield_farmer", x_display_name: "Yield Farmer 🌾" },
  { x_account_id: "147258369", x_username: "moon_seeker", x_display_name: "Moon Seeker 🌙" },
  { x_account_id: "963852741", x_username: "diamond_hands", x_display_name: "Diamond Hands 💎" },
  { x_account_id: "258147369", x_username: "degen_trader", x_display_name: "Degen Trader 🔥" },
  { x_account_id: "741963852", x_username: "alpha_hunter", x_display_name: "Alpha Hunter 🎯" },
  { x_account_id: "159753486", x_username: "whale_watcher", x_display_name: "Whale Watcher 🐋" }
];

const generateRandomFollowers = () => Math.floor(Math.random() * 45000) + 5000;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<MockUser | null>(null);
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<MockProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const isXConnected = !!(profile?.x_account_id && profile?.x_username);

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

  const signInWithX = async () => {
    try {
      setLoading(true);
      
      // Simulate OAuth redirect delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Generate mock user data with proper UUID format
      const mockXUser = MOCK_X_USERS[Math.floor(Math.random() * MOCK_X_USERS.length)];
      // Generate a proper UUID v4 format for mock user
      const userId = crypto.randomUUID();
      
      const mockUser: MockUser = {
        id: userId,
        email: `${mockXUser.x_username}@example.com`,
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
        username: mockXUser.x_username,
        display_name: mockXUser.x_display_name,
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${mockXUser.x_username}`,
        x_account_id: mockXUser.x_account_id,
        x_username: mockXUser.x_username,
        x_display_name: mockXUser.x_display_name,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Save profile to Supabase database
      console.log('Saving profile to database:', {
        user_id: userId,
        username: mockXUser.x_username,
        display_name: mockXUser.x_display_name,
      });
      
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .upsert({
          user_id: userId,
          username: mockXUser.x_username,
          display_name: mockXUser.x_display_name,
          avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${mockXUser.x_username}`,
          x_account_id: mockXUser.x_account_id,
          x_username: mockXUser.x_username,
          x_display_name: mockXUser.x_display_name
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
      console.error('Error in mock signInWithX:', error);
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
      console.error('Error in mock signOut:', error);
      throw error;
    }
  };

  const value = {
    user,
    session,
    profile,
    loading,
    signInWithX,
    signOut,
    isXConnected,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};