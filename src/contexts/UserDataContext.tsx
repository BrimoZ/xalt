import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UserHolding {
  id: string;
  token_id: string;
  balance: number;
  average_price: number;
  total_invested: number;
  token: {
    name: string;
    symbol: string;
    current_price: number;
    price_change_24h: number;
  };
}

interface TokenClaim {
  id: string;
  token_name: string;
  token_amount: number;
  token_value: number;
  expires_at: string;
  claimed: boolean;
  claimed_at?: string;
}

interface Trade {
  id: string;
  trade_type: 'buy' | 'sell';
  token_amount: number;
  sol_amount: number;
  price_per_token: number;
  transaction_hash?: string;
  created_at: string;
  token: {
    name: string;
    symbol: string;
  };
}

interface UserDataContextType {
  holdings: UserHolding[];
  claims: TokenClaim[];
  trades: Trade[];
  loading: boolean;
  totalPortfolioValue: number;
  refreshUserData: () => Promise<void>;
  claimToken: (claimId: string) => Promise<void>;
  createSampleData: () => Promise<void>;
}

const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

export const useUserData = () => {
  const context = useContext(UserDataContext);
  if (context === undefined) {
    throw new Error('useUserData must be used within a UserDataProvider');
  }
  return context;
};

export const UserDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [holdings, setHoldings] = useState<UserHolding[]>([]);
  const [claims, setClaims] = useState<TokenClaim[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // Fetch user holdings with token data
      const { data: holdingsData, error: holdingsError } = await supabase
        .from('user_holdings')
        .select(`
          *,
          token:tokens(name, symbol, current_price, price_change_24h)
        `)
        .eq('user_id', user.id);

      if (holdingsError) {
        console.error('Error fetching holdings:', holdingsError);
      } else {
        setHoldings(holdingsData || []);
      }

      // Fetch user claims
      const { data: claimsData, error: claimsError } = await supabase
        .from('token_claims')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (claimsError) {
        console.error('Error fetching claims:', claimsError);
      } else {
        setClaims(claimsData || []);
      }

      // Fetch user trades
      const { data: tradesData, error: tradesError } = await supabase
        .from('trades')
        .select(`
          *,
          token:tokens(name, symbol)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (tradesError) {
        console.error('Error fetching trades:', tradesError);
      } else {
        const transformedTrades = (tradesData || []).map(trade => ({
          ...trade,
          trade_type: trade.trade_type as 'buy' | 'sell'
        })) as Trade[];
        setTrades(transformedTrades);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const totalPortfolioValue = holdings.reduce((total, holding) => {
    return total + (holding.balance * (holding.token?.current_price || 0));
  }, 0);

  const refreshUserData = async () => {
    setLoading(true);
    await fetchUserData();
  };

  const claimToken = async (claimId: string) => {
    try {
      const { error } = await supabase
        .from('token_claims')
        .update({
          claimed: true,
          claimed_at: new Date().toISOString()
        })
        .eq('id', claimId);

      if (error) {
        console.error('Error claiming token:', error);
        throw error;
      }

      // Refresh claims
      await fetchUserData();
    } catch (error) {
      console.error('Error in claimToken:', error);
      throw error;
    }
  };

  const createSampleData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Call the database function to create sample data
      const { error } = await supabase.rpc('create_sample_data_for_user', {
        user_uuid: user.id
      });

      if (error) {
        console.error('Error creating sample data:', error);
        return;
      }

      // Refresh user data
      await fetchUserData();
    } catch (error) {
      console.error('Error creating sample data:', error);
    }
  };

  const value = {
    holdings,
    claims,
    trades,
    loading,
    totalPortfolioValue,
    refreshUserData,
    claimToken,
    createSampleData,
  };

  return <UserDataContext.Provider value={value}>{children}</UserDataContext.Provider>;
};