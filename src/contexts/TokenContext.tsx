import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Token {
  id: string;
  creator_id: string;
  name: string;
  symbol: string;
  description: string | null;
  image_url: string | null;
  images: string[] | null;
  website_url: string | null;
  x_url: string | null;
  telegram_url: string | null;
  discord_url: string | null;
  goal_amount: number;
  current_amount: number;
  current_price: number;
  price_change_24h: number;
  created_at: string;
  updated_at: string;
}

interface TokenContextType {
  tokens: Token[];
  loading: boolean;
  getToken: (id: string) => Token | undefined;
  refreshTokens: () => Promise<void>;
}

const TokenContext = createContext<TokenContextType | undefined>(undefined);

export const useTokens = () => {
  const context = useContext(TokenContext);
  if (context === undefined) {
    throw new Error('useTokens must be used within a TokenProvider');
  }
  return context;
};

export const TokenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTokens = async () => {
    try {
      const { data, error } = await supabase
        .from('tokens')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        // If JWT expired, try to refresh session or clear it
        if (error.code === 'PGRST303') {
          await supabase.auth.refreshSession();
          // Retry the query
          const { data: retryData, error: retryError } = await supabase
            .from('tokens')
            .select('*')
            .order('created_at', { ascending: false });
          
          if (retryError) {
            console.error('Error fetching tokens after refresh:', retryError);
            return;
          }
          
          // Calculate current_amount from donations
          if (retryData) {
            const tokensWithDonations = await Promise.all(
              retryData.map(async (token) => {
                const { data: donationData } = await supabase
                  .from('token_donations')
                  .select('amount')
                  .eq('token_id', token.id);
                
                const totalDonated = donationData?.reduce((sum, d) => sum + Number(d.amount), 0) || 0;
                return { ...token, current_amount: totalDonated };
              })
            );
            setTokens(tokensWithDonations);
          }
          return;
        }
        console.error('Error fetching tokens:', error);
        return;
      }

      // Calculate current_amount from donations for each token
      if (data) {
        const tokensWithDonations = await Promise.all(
          data.map(async (token) => {
            const { data: donationData } = await supabase
              .from('token_donations')
              .select('amount')
              .eq('token_id', token.id);
            
            const totalDonated = donationData?.reduce((sum, d) => sum + Number(d.amount), 0) || 0;
            return { ...token, current_amount: totalDonated };
          })
        );
        setTokens(tokensWithDonations);
      } else {
        setTokens([]);
      }
    } catch (error) {
      console.error('Error fetching tokens:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTokens();
  }, []);

  const getToken = (id: string) => {
    return tokens.find(token => token.id === id);
  };

  const refreshTokens = async () => {
    await fetchTokens();
  };

  const value = {
    tokens,
    loading,
    getToken,
    refreshTokens,
  };

  return <TokenContext.Provider value={value}>{children}</TokenContext.Provider>;
};