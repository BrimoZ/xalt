import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Token {
  id: string;
  name: string;
  symbol: string;
  description: string;
  image_url?: string;
  website_url?: string;
  x_handle?: string;
  telegram_url?: string;
  discord_url?: string;
  total_supply: string;
  hardcap: string;
  contributor_type: 'any' | 'followers';
  creator_id: string;
  creator_username: string;
  created_at: string;
  updated_at: string;
  // Trading data
  current_price: number;
  market_cap: number;
  volume_24h: number;
  price_change_24h: number;
  raised: number;
  progress: number;
  holders: number;
  bonding_curve_progress: number;
  total_contributions: number;
}

interface TokenContextType {
  tokens: Token[];
  loading: boolean;
  addToken: (token: Omit<Token, 'id' | 'created_at' | 'updated_at' | 'current_price' | 'market_cap' | 'volume_24h' | 'price_change_24h' | 'raised' | 'progress' | 'holders' | 'bonding_curve_progress' | 'total_contributions'>) => Promise<Token>;
  getToken: (id: string) => Token | undefined;
  updateTokenPrice: (id: string, newPrice: number, volume: number) => Promise<void>;
  buyToken: (tokenId: string, amount: number, solAmount: number) => Promise<void>;
  sellToken: (tokenId: string, amount: number, solAmount: number) => Promise<void>;
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
        console.error('Error fetching tokens:', error);
        return;
      }

      // Transform database response to match interface
      const transformedTokens = (data || []).map(token => ({
        ...token,
        total_supply: token.total_supply.toString(),
        hardcap: token.hardcap.toString(),
        contributor_type: token.contributor_type as 'any' | 'followers'
      })) as Token[];
      setTokens(transformedTokens);
    } catch (error) {
      console.error('Error fetching tokens:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTokens();
  }, []);

  const addToken = async (tokenData: Omit<Token, 'id' | 'created_at' | 'updated_at' | 'current_price' | 'market_cap' | 'volume_24h' | 'price_change_24h' | 'raised' | 'progress' | 'holders' | 'bonding_curve_progress' | 'total_contributions'>): Promise<Token> => {
    try {
      const { data, error } = await supabase
        .from('tokens')
        .insert([{
          name: tokenData.name,
          symbol: tokenData.symbol,
          description: tokenData.description,
          image_url: tokenData.image_url,
          website_url: tokenData.website_url,
          x_handle: tokenData.x_handle,
          telegram_url: tokenData.telegram_url,
          discord_url: tokenData.discord_url,
          total_supply: parseInt(tokenData.total_supply),
          hardcap: parseFloat(tokenData.hardcap),
          contributor_type: tokenData.contributor_type,
          creator_id: tokenData.creator_id,
          creator_username: tokenData.creator_username,
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating token:', error);
        throw error;
      }

      const newToken = {
        ...data,
        total_supply: data.total_supply.toString(),
        hardcap: data.hardcap.toString(),
        contributor_type: data.contributor_type as 'any' | 'followers'
      } as Token;
      setTokens(prev => [newToken, ...prev]);
      return newToken;
    } catch (error) {
      console.error('Error in addToken:', error);
      throw error;
    }
  };

  const getToken = (id: string) => {
    return tokens.find(token => token.id === id);
  };

  const updateTokenPrice = async (id: string, newPrice: number, volume: number) => {
    try {
      const token = tokens.find(t => t.id === id);
      if (!token) return;

      const oldPrice = token.current_price;
      const priceChange = ((newPrice - oldPrice) / oldPrice) * 100;
      const newMarketCap = newPrice * parseFloat(token.total_supply);
      const newVolume = token.volume_24h + volume;

      const { error } = await supabase
        .from('tokens')
        .update({
          current_price: newPrice,
          market_cap: newMarketCap,
          volume_24h: newVolume,
          price_change_24h: priceChange,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        console.error('Error updating token price:', error);
        return;
      }

      // Add to price history
      await supabase
        .from('price_history')
        .insert([{
          token_id: id,
          price: newPrice,
          volume: volume,
          market_cap: newMarketCap
        }]);

      // Update local state
      setTokens(prev => prev.map(token => {
        if (token.id === id) {
          return {
            ...token,
            current_price: newPrice,
            market_cap: newMarketCap,
            volume_24h: newVolume,
            price_change_24h: priceChange
          };
        }
        return token;
      }));
    } catch (error) {
      console.error('Error updating token price:', error);
    }
  };

  const buyToken = async (tokenId: string, amount: number, solAmount: number) => {
    try {
      const token = tokens.find(t => t.id === tokenId);
      if (!token) return;

      const newRaised = token.raised + solAmount;
      const newProgress = (newRaised / parseFloat(token.hardcap)) * 100;
      const priceImpact = (solAmount / 10) * 0.001; // Simplified price impact
      const newPrice = token.current_price * (1 + priceImpact);
      const newVolume = token.volume_24h + solAmount;

      // Update token stats
      const { error: tokenError } = await supabase
        .from('tokens')
        .update({
          raised: newRaised,
          progress: Math.min(newProgress, 100),
          bonding_curve_progress: Math.min(newProgress, 100),
          total_contributions: newRaised,
          current_price: newPrice,
          volume_24h: newVolume,
          market_cap: newPrice * parseFloat(token.total_supply),
          holders: token.holders + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', tokenId);

      if (tokenError) {
        console.error('Error updating token in buyToken:', tokenError);
        return;
      }

      // Update local state
      setTokens(prev => prev.map(t => {
        if (t.id === tokenId) {
          return {
            ...t,
            raised: newRaised,
            progress: Math.min(newProgress, 100),
            bonding_curve_progress: Math.min(newProgress, 100),
            total_contributions: newRaised,
            current_price: newPrice,
            volume_24h: newVolume,
            market_cap: newPrice * parseFloat(token.total_supply),
            holders: token.holders + 1
          };
        }
        return t;
      }));
    } catch (error) {
      console.error('Error in buyToken:', error);
    }
  };

  const sellToken = async (tokenId: string, amount: number, solAmount: number) => {
    try {
      const token = tokens.find(t => t.id === tokenId);
      if (!token) return;

      const priceImpact = (solAmount / 10) * 0.001; // Simplified price impact
      const newPrice = Math.max(token.current_price * (1 - priceImpact), 0.00001);
      const newVolume = token.volume_24h + solAmount;
      const newMarketCap = newPrice * parseFloat(token.total_supply);

      const { error } = await supabase
        .from('tokens')
        .update({
          current_price: newPrice,
          volume_24h: newVolume,
          market_cap: newMarketCap,
          updated_at: new Date().toISOString()
        })
        .eq('id', tokenId);

      if (error) {
        console.error('Error updating token in sellToken:', error);
        return;
      }

      // Update local state
      setTokens(prev => prev.map(t => {
        if (t.id === tokenId) {
          return {
            ...t,
            current_price: newPrice,
            volume_24h: newVolume,
            market_cap: newMarketCap
          };
        }
        return t;
      }));
    } catch (error) {
      console.error('Error in sellToken:', error);
    }
  };

  const refreshTokens = async () => {
    await fetchTokens();
  };

  const value = {
    tokens,
    loading,
    addToken,
    getToken,
    updateTokenPrice,
    buyToken,
    sellToken,
    refreshTokens,
  };

  return <TokenContext.Provider value={value}>{children}</TokenContext.Provider>;
};