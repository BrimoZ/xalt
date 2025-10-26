import Navbar from "@/components/Navbar";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, TrendingUp, TrendingDown, Users2, Copy, ExternalLink, Wallet, BarChart3, Activity, Crown, MessageCircle, Trophy } from "lucide-react";
import { useState, useEffect } from "react";
import { useTokens } from "@/contexts/TokenContext";
import { TokenChart } from "@/components/TokenChart";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const TokenDetail = () => {
  const { tokenId } = useParams();
  const navigate = useNavigate();
  const { tokens, buyToken, sellToken } = useTokens();
  const { toast } = useToast();
  const { user, isWalletConnected } = useAuth();
  const [buyAmount, setBuyAmount] = useState("");
  const [tradingMode, setTradingMode] = useState<'buy' | 'sell'>('buy');
  const [loading, setLoading] = useState(false);
  const [trades, setTrades] = useState<any[]>([]);
  const [holders, setHolders] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [currentToken, setCurrentToken] = useState<any>(tokens.find(t => t.id === tokenId));

  // Load trades and holders data
  useEffect(() => {
    if (tokenId) {
      loadTrades();
      loadHolders();
      loadTokenData();
      loadComments();
      
      // Set up real-time updates for trades
      const tradesChannel = supabase
        .channel('trades-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'trades',
            filter: `token_id=eq.${tokenId}`
          },
          () => {
            loadTrades();
            loadHolders();
            loadTokenData();
          }
        )
        .subscribe();
        
      // Set up real-time updates for user holdings
      const holdingsChannel = supabase
        .channel('holdings-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'user_holdings',
            filter: `token_id=eq.${tokenId}`
          },
          () => {
            loadHolders();
          }
        )
        .subscribe();
        
      return () => {
        supabase.removeChannel(tradesChannel);
        supabase.removeChannel(holdingsChannel);
      };
    }
  }, [tokenId]);

  const loadTokenData = async () => {
    const { data } = await supabase
      .from('tokens')
      .select('*')
      .eq('id', tokenId)
      .single();
    
    if (data) {
      setCurrentToken(data);
    }
  };

  const loadTrades = async () => {
    console.log('Loading trades for token:', tokenId);
    
    // First get trades
    const { data: tradesData, error: tradesError } = await supabase
      .from('trades')
      .select('*')
      .eq('token_id', tokenId)
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (tradesError) {
      console.error('Error loading trades:', tradesError);
      setTrades([]);
      return;
    }

    // Then get profiles for those users
    if (tradesData && tradesData.length > 0) {
      const userIds = tradesData.map(trade => trade.user_id);
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('*')
        .in('user_id', userIds);

      // Join trades with profiles
      const tradesWithProfiles = tradesData.map(trade => ({
        ...trade,
        profiles: profilesData?.find(profile => profile.user_id === trade.user_id) || null
      }));

      console.log('Trades with profiles:', tradesWithProfiles);
      setTrades(tradesWithProfiles);
    } else {
      setTrades([]);
    }
  };

  const loadHolders = async () => {
    console.log('Loading holders for token:', tokenId);
    
    // First get holdings
    const { data: holdingsData, error: holdingsError } = await supabase
      .from('user_holdings')
      .select('*')
      .eq('token_id', tokenId)
      .order('balance', { ascending: false })
      .limit(10);
    
    if (holdingsError) {
      console.error('Error loading holdings:', holdingsError);
      setHolders([]);
      return;
    }

    // Then get profiles for those users
    if (holdingsData && holdingsData.length > 0) {
      const userIds = holdingsData.map(holding => holding.user_id);
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('*')
        .in('user_id', userIds);

      // Join holdings with profiles
      const holdingsWithProfiles = holdingsData.map(holding => ({
        ...holding,
        profiles: profilesData?.find(profile => profile.user_id === holding.user_id) || null
      }));

      console.log('Holdings with profiles:', holdingsWithProfiles);
      setHolders(holdingsWithProfiles);
    } else {
      setHolders([]);
    }
  };

  const loadComments = async () => {
    console.log('Loading comments for token:', tokenId);
    
    const { data: commentsData, error: commentsError } = await supabase
      .from('token_comments')
      .select('*')
      .eq('token_id', tokenId)
      .order('created_at', { ascending: false })
      .limit(20);
    
    if (commentsError) {
      console.error('Error loading comments:', commentsError);
      setComments([]);
      return;
    }

    if (commentsData && commentsData.length > 0) {
      const userIds = commentsData.map(comment => comment.user_id);
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('*')
        .in('user_id', userIds);

      const commentsWithProfiles = commentsData.map(comment => ({
        ...comment,
        profiles: profilesData?.find(profile => profile.user_id === comment.user_id) || null
      }));

      setComments(commentsWithProfiles);
    } else {
      setComments([]);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !user) return;
    
    try {
      const { error } = await supabase
        .from('token_comments')
        .insert({
          token_id: tokenId,
          user_id: user.id,
          content: newComment.trim()
        });

      if (error) {
        console.error('Error submitting comment:', error);
        toast({
          title: "Error",
          description: "Failed to submit comment",
          variant: "destructive"
        });
        return;
      }

      setNewComment("");
      loadComments();
      toast({
        title: "Comment posted! 💬",
        description: "Your comment has been added"
      });
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };
  
  // Use currentToken for real-time updates
  const displayToken = currentToken || tokens.find(t => t.id === tokenId);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toFixed(2);
  };

  const formatPrice = (price: number) => {
    if (price < 0.00001) return price.toExponential(2);
    if (price < 0.01) return price.toFixed(8);
    if (price < 1) return price.toFixed(6);
    return price.toFixed(4);
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const created = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - created.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const handleBuy = async () => {
    if (!displayToken || !buyAmount) return;
    
    if (!user || !isXConnected) {
      toast({
        title: "Authentication Required",
        description: "Please connect with X to trade tokens.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }
    
    setLoading(true);
    try {
      const solAmount = parseFloat(buyAmount);
      const tokenAmount = solAmount / displayToken.current_price;
      
      // Calculate new price based on bonding curve (simple linear increase)
      const priceIncrease = solAmount / Number(displayToken.hardcap) * 0.0001; // Small increase per SOL
      const newPrice = Number(displayToken.current_price) + priceIncrease;
      
      // Calculate new market cap and bonding curve progress
      const newMarketCap = newPrice * Number(displayToken.total_supply);
      const totalRaised = Number(displayToken.raised || 0) + solAmount;
      const bondingProgress = Math.min((totalRaised / Number(displayToken.hardcap)) * 100, 100);
      
      await buyToken(displayToken.id, solAmount, displayToken.current_price);
      
      console.log('Inserting trade:', {
        token_id: displayToken.id,
        user_id: '00000000-0000-0000-0000-000000000001', // Valid UUID format for mock user
        trade_type: 'buy',
        sol_amount: solAmount,
        token_amount: tokenAmount,
        price_per_token: displayToken.current_price
      });

      const { data: tradeData, error: tradeError } = await supabase.from('trades').insert({
        token_id: displayToken.id,
        user_id: user.id,
        trade_type: 'buy',
        sol_amount: solAmount,
        token_amount: tokenAmount,
        price_per_token: displayToken.current_price
      });
      
      console.log('Trade insert result:', tradeData, 'Error:', tradeError);
      
      // Update or create user holding
      console.log('Checking for existing holding...');
      const { data: existingHolding, error: holdingSelectError } = await supabase
        .from('user_holdings')
        .select('*')
        .eq('token_id', displayToken.id)
        .eq('user_id', user.id)
        .maybeSingle();

      console.log('Existing holding:', existingHolding, 'Error:', holdingSelectError);

      if (existingHolding) {
        console.log('Updating existing holding...');
        const { data: updateData, error: updateError } = await supabase.from('user_holdings').update({
          balance: Number(existingHolding.balance) + tokenAmount,
          total_invested: Number(existingHolding.total_invested) + solAmount,
          average_price: (Number(existingHolding.total_invested) + solAmount) / (Number(existingHolding.balance) + tokenAmount)
        }).eq('id', existingHolding.id);
        console.log('Update result:', updateData, 'Error:', updateError);
      } else {
        console.log('Creating new holding...');
        const { data: insertData, error: insertError } = await supabase.from('user_holdings').insert({
          user_id: user.id,
          token_id: displayToken.id,
          balance: tokenAmount,
          total_invested: solAmount,
          average_price: displayToken.current_price
        });
        console.log('Insert result:', insertData, 'Error:', insertError);
      }
      
      // Update token metrics
      console.log('Updating token with:', {
        current_price: newPrice,
        market_cap: newMarketCap,
        bonding_curve_progress: bondingProgress,
        volume_24h: Number(displayToken.volume_24h) + solAmount,
        holders: Number(displayToken.holders) + 1,
        raised: totalRaised
      });
      
      const { data: tokenUpdateData, error: tokenUpdateError } = await supabase.from('tokens').update({
        current_price: newPrice,
        market_cap: newMarketCap,
        bonding_curve_progress: bondingProgress,
        volume_24h: Number(displayToken.volume_24h) + solAmount,
        holders: Number(displayToken.holders) + 1,
        raised: totalRaised
      }).eq('id', displayToken.id);
      
      console.log('Token update result:', tokenUpdateData, 'Error:', tokenUpdateError);
      
      toast({
        title: "Purchase Successful! 🎉",
        description: `You bought ${buyAmount} SOL worth of ${displayToken.symbol}`,
      });
      setBuyAmount("");
      
      // Trigger chart transaction effect
      if ((window as any).addChartTransaction) {
        (window as any).addChartTransaction('buy', solAmount);
      }
      
      // Reload data instead of refreshing page
      console.log('Reloading data after buy...');
      await Promise.all([loadTrades(), loadHolders(), loadTokenData()]);
      console.log('Data reloaded successfully');
      
    } catch (error) {
      console.error('Buy error:', error);
      toast({
        title: "Purchase Failed",
        description: "There was an error processing your purchase.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSell = async () => {
    if (!displayToken || !buyAmount) return;
    
    if (!user || !isXConnected) {
      toast({
        title: "Authentication Required",
        description: "Please connect with X to trade tokens.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }
    
    setLoading(true);
    try {
      const solAmount = parseFloat(buyAmount);
      const tokenAmount = solAmount / displayToken.current_price;
      
      // Calculate new price based on bonding curve (simple linear decrease)
      const priceDecrease = solAmount / Number(displayToken.hardcap) * 0.0001; // Small decrease per SOL
      const newPrice = Math.max(Number(displayToken.current_price) - priceDecrease, 0.000001); // Minimum price
      
      // Calculate new market cap and bonding curve progress  
      const newMarketCap = newPrice * Number(displayToken.total_supply);
      const totalRaised = Math.max(Number(displayToken.raised || 0) - solAmount, 0);
      const bondingProgress = Math.min((totalRaised / Number(displayToken.hardcap)) * 100, 100);
      
      await sellToken(displayToken.id, solAmount, displayToken.current_price);
      
      console.log('Inserting sell trade...');
      const { data: sellTradeData, error: sellTradeError } = await supabase.from('trades').insert({
        token_id: displayToken.id,
        user_id: user.id,
        trade_type: 'sell',
        sol_amount: solAmount,
        token_amount: tokenAmount,
        price_per_token: displayToken.current_price
      });
      
      console.log('Sell trade result:', sellTradeData, 'Error:', sellTradeError);
      
      // Update token metrics
      const totalRaisedSell = Math.max(Number(displayToken.raised || 0) - solAmount, 0);
      const bondingProgressSell = Math.min((totalRaisedSell / Number(displayToken.hardcap)) * 100, 100);
      
      await supabase.from('tokens').update({
        current_price: newPrice,
        market_cap: newMarketCap,
        bonding_curve_progress: bondingProgressSell,
        volume_24h: Number(displayToken.volume_24h) + solAmount,
        raised: totalRaisedSell
      }).eq('id', displayToken.id);
      
      toast({
        title: "Sale Successful! 💰",
        description: `You sold ${buyAmount} SOL worth of ${displayToken.symbol}`,
      });
      setBuyAmount("");
      
      // Trigger chart transaction effect
      if ((window as any).addChartTransaction) {
        (window as any).addChartTransaction('sell', solAmount);
      }
      
      // Reload data instead of refreshing page
      await Promise.all([loadTrades(), loadHolders(), loadTokenData()]);
      
    } catch (error) {
      console.error('Sell error:', error);
      toast({
        title: "Sale Failed",
        description: "There was an error processing your sale.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Address copied to clipboard",
    });
  };

  // Show loading or not found states
  if (!displayToken) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Token Not Found</h1>
          <p className="text-muted-foreground mb-8">The token you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate("/")} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      {/* Compact Header */}
      <div className="border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/")}
              className="gap-2 text-muted-foreground hover:text-primary"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            
            <Badge variant="default" className="animate-pulse">
              LIVE • {getTimeAgo(displayToken.created_at)}
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        
          <div className="bg-card border border-border rounded-lg p-4 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {displayToken.image_url ? (
                  <img src={displayToken.image_url} alt={displayToken.name} className="w-12 h-12 rounded-lg object-cover" />
                ) : (
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-background font-bold text-lg">
                    {displayToken.symbol.slice(0, 2)}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-2xl font-bold text-foreground">{displayToken.name}</h1>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-primary font-medium">@{displayToken.creator_username}</span>
                      <span className="text-primary">✓</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>${displayToken.symbol}</span>
                    <div className="flex items-center gap-2">
                      <span>Supply:</span>
                      <code className="bg-secondary/50 px-2 py-1 rounded text-xs font-mono">{formatNumber(parseInt(displayToken.total_supply))}</code>
                    </div>
                    {displayToken.website_url && (
                      <a href={displayToken.website_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        Website
                      </a>
                    )}
                    {displayToken.x_handle && (
                      <a href={`https://x.com/${displayToken.x_handle.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        X/Twitter
                      </a>
                    )}
                    {displayToken.telegram_url && (
                      <a href={displayToken.telegram_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        Telegram
                      </a>
                    )}
                    {displayToken.discord_url && (
                      <a href={displayToken.discord_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        Discord
                      </a>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="text-center bg-secondary/20 rounded-lg px-4 py-3 border border-border/30">
                  <div className="text-lg font-bold text-primary">${formatNumber(displayToken.market_cap)}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Market Cap</div>
                </div>
                
                <div className="text-center bg-secondary/20 rounded-lg px-4 py-3 border border-border/30">
                  <div className="text-lg font-bold text-primary">${formatNumber(displayToken.volume_24h)}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Volume 24H</div>
                </div>
                
                <div className="text-right bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg px-4 py-3 border border-primary/20">
                  <div className="text-2xl font-bold text-primary font-mono">${formatPrice(displayToken.current_price)}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Current Price</div>
                </div>
              </div>
            </div>
          </div>

        {/* Main Content Grid - Rearranged Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Side - Chart & Live Activity */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Price Chart - Large */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Price Chart
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">1H</Button>
                    <Button variant="outline" size="sm">24H</Button>
                    <Button size="sm">7D</Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <ExternalLink className="w-4 h-4" />
                      Dexscreener
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <TokenChart 
                  currentPrice={displayToken.current_price}
                  onPriceChange={(newPrice, newMarketCap) => {
                    setCurrentToken(prev => prev ? {...prev, current_price: newPrice, market_cap: newMarketCap} : null);
                  }}
                  tokenSymbol={displayToken.symbol}
                  tokenId={displayToken.id}
                  totalSupply={Number(displayToken.total_supply)}
                />
              </CardContent>
            </Card>


            {/* Live Activity Feed with Tabs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Live Activity
                  <Badge variant="default" className="ml-2 animate-pulse">LIVE</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="trades" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="trades" className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4" />
                      Trades
                    </TabsTrigger>
                    <TabsTrigger value="comments" className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      Comments
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="trades" className="space-y-3 max-h-80 overflow-y-auto mt-4">
                    {trades.length > 0 ? (
                      trades.map((trade) => (
                        <div key={trade.id} className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg border">
                          <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${trade.trade_type === 'buy' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            <div>
                              <div className="font-medium">
                                {trade.trade_type === 'buy' ? 'Buy' : 'Sell'} {formatNumber(trade.token_amount)} {displayToken.symbol}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {trade.profiles ? 
                                  `@${trade.profiles.x_username || trade.profiles.username || 'Unknown'}` : 
                                  'Anonymous'
                                } • {getTimeAgo(trade.created_at)}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{formatNumber(trade.sol_amount)} SOL</div>
                            <div className="text-sm text-muted-foreground">${formatPrice(trade.price_per_token)}</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No trades yet</p>
                        <p className="text-sm">Be the first to trade this token!</p>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="comments" className="space-y-3 max-h-80 overflow-y-auto mt-4">
                    {comments.length > 0 ? (
                      comments.map((comment) => (
                        <div key={comment.id} className="p-3 bg-secondary/20 rounded-lg border">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-background font-bold text-xs">
                              {comment.profiles?.x_username?.charAt(0).toUpperCase() || '?'}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-sm">
                                  @{comment.profiles?.x_username || 'Anonymous'}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {getTimeAgo(comment.created_at)}
                                </span>
                              </div>
                              <p className="text-sm">{comment.content}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No comments yet</p>
                        <p className="text-sm">Start the conversation!</p>
                      </div>
                    )}
                    
                    {/* Comment Input */}
                    {user && isXConnected && (
                      <div className="mt-4 p-3 bg-secondary/10 rounded-lg border-t">
                        <div className="flex gap-3">
                          <Input
                            placeholder="Share your thoughts..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSubmitComment()}
                            className="flex-1"
                          />
                          <Button 
                            onClick={handleSubmitComment}
                            disabled={!newComment.trim()}
                            size="sm"
                          >
                            Post
                          </Button>
                        </div>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar - Metrics, Trading & Holders */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Bonding Curve Progress */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Bonding Curve Progress</CardTitle>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Progress</span>
                    <span className="text-2xl font-bold text-primary">{displayToken.bonding_curve_progress.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-secondary/50 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-primary to-primary/80 rounded-full h-3 transition-all duration-300"
                      style={{ width: `${displayToken.bonding_curve_progress}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Advanced Trading */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="w-5 h-5" />
                  Trade ${displayToken.symbol}
                </CardTitle>
              </CardHeader>
               <CardContent className="space-y-4">
                {/* Buy/Sell Toggle */}
                <div className="grid grid-cols-2 gap-1 p-1 bg-secondary/20 rounded-lg">
                  <Button
                    variant={tradingMode === 'buy' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setTradingMode('buy')}
                    className="h-10"
                  >
                    Buy
                  </Button>
                  <Button
                    variant={tradingMode === 'sell' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setTradingMode('sell')}
                    className="h-10"
                  >
                    Sell
                  </Button>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium">
                      {tradingMode === 'buy' ? 'Amount (SOL)' : `Amount (${displayToken.symbol})`}
                    </label>
                    <span className="text-xs text-muted-foreground">
                      {tradingMode === 'buy' ? (
                        <>Balance: 2.45 SOL</>
                      ) : (
                        <>Available: {holders.find(h => h.user_id === user?.id)?.balance || 0} {displayToken.symbol}</>
                      )}
                    </span>
                  </div>
                  <Input
                    type="number"
                    placeholder="0.0"
                    value={buyAmount}
                    onChange={(e) => setBuyAmount(e.target.value)}
                    className="text-lg h-12"
                  />
                  {buyAmount && (
                    <div className="mt-2 text-xs text-muted-foreground">
                      {tradingMode === 'buy' ? (
                        <>Total SOL: {buyAmount} • Total Tokens: ≈{Math.floor(parseFloat(buyAmount) / displayToken.current_price).toLocaleString()}</>
                      ) : (
                        <>Total Tokens: {buyAmount} • Total SOL: ≈{(parseFloat(buyAmount) * displayToken.current_price).toFixed(4)}</>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Quick Amount Buttons */}
                <div className="grid grid-cols-4 gap-2">
                  {tradingMode === 'buy' ? (
                    <>
                      <Button variant="outline" size="sm" onClick={() => setBuyAmount("0.1")}>0.1</Button>
                      <Button variant="outline" size="sm" onClick={() => setBuyAmount("0.5")}>0.5</Button>
                      <Button variant="outline" size="sm" onClick={() => setBuyAmount("1.0")}>1.0</Button>
                      <Button variant="outline" size="sm" onClick={() => setBuyAmount("2.0")}>MAX</Button>
                    </>
                  ) : (
                    <>
                      <Button variant="outline" size="sm" onClick={() => setBuyAmount("25")}>25%</Button>
                      <Button variant="outline" size="sm" onClick={() => setBuyAmount("50")}>50%</Button>
                      <Button variant="outline" size="sm" onClick={() => setBuyAmount("75")}>75%</Button>
                      <Button variant="outline" size="sm" onClick={() => setBuyAmount("100")}>MAX</Button>
                    </>
                  )}
                </div>
                
                <Button 
                  className={`h-12 text-lg font-bold w-full ${
                    tradingMode === 'sell' ? 'bg-red-500 hover:bg-red-600' : ''
                  }`}
                  onClick={tradingMode === 'buy' ? handleBuy : handleSell}
                  disabled={loading || !buyAmount}
                  variant={tradingMode === 'sell' ? 'destructive' : 'default'}
                >
                  {loading ? "Processing..." : tradingMode.toUpperCase()}
                </Button>
                
                {/* Estimated Output */}
                <div className="p-3 bg-secondary/20 rounded-lg border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">You'll receive ≈</span>
                    <span className="font-medium">
                      {buyAmount ? (
                        tradingMode === 'buy' 
                          ? `${Math.floor(parseFloat(buyAmount) / displayToken.current_price).toLocaleString()} ${displayToken.symbol}`
                          : `${(parseFloat(buyAmount) * displayToken.current_price).toFixed(4)} SOL`
                      ) : (
                        tradingMode === 'buy' ? `0 ${displayToken.symbol}` : '0 SOL'
                      )}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Holders - Enhanced Design */}
            <Card className="overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-primary" />
                    <CardTitle className="text-lg">Top Holders</CardTitle>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {holders.length} holders
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {holders.length > 0 ? (
                  <div className="space-y-3 p-4">
                    {holders.slice(0, 6).map((holder, index) => {
                      const isCurrentUser = user && holder.user_id === user.id;
                      const followerCount = Math.floor(Math.random() * 50000) + 1000;
                      // Cap holdings at 10% of total supply, randomize between 1-10%
                      const randomHoldingPercentage = (Math.random() * 9 + 1).toFixed(2); // Random 1-10%
                      const maxAllowedBalance = (Number(displayToken.total_supply) * 0.1); // 10% cap
                      const adjustedBalance = Math.min(holder.balance, maxAllowedBalance);
                      const holdingPercentage = randomHoldingPercentage;
                      
                      // Simple badges for rank color only
                      const rankColors = [
                        "bg-blue-500",
                        "bg-purple-500", 
                        "bg-green-500",
                        "bg-yellow-500",
                        "bg-red-500",
                        "bg-orange-500"
                      ];
                      
                      const rankColor = rankColors[index] || rankColors[rankColors.length - 1];
                      
                      return (
                        <div 
                          key={holder.id} 
                          className={`flex items-center gap-4 p-4 rounded-lg border transition-all hover:shadow-md ${
                            isCurrentUser ? 'bg-primary/5 border-primary/20' : 'hover:bg-secondary/20'
                          }`}
                        >
                          {/* Rank */}
                          <div className={`w-8 h-8 rounded-full ${rankColor} flex items-center justify-center text-white font-bold text-sm`}>
                            #{index + 1}
                          </div>
                          
                          {/* Avatar */}
                          <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center font-bold text-foreground">
                            {holder.profiles?.x_username?.charAt(0).toUpperCase() || '?'}
                          </div>
                          
                          {/* User Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-sm">
                                @{holder.profiles?.x_username || holder.profiles?.username || 'Anonymous'}
                              </span>
                              {isCurrentUser && (
                                <Badge variant="default" className="text-xs px-1 py-0">
                                  You
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Users2 className="w-3 h-3" />
                              <span>{followerCount.toLocaleString()} followers</span>
                            </div>
                          </div>
                          
                          {/* Token Amount & Percentage */}
                          <div className="text-right">
                            <div className="font-bold text-sm">
                              {formatNumber(holder.balance)} {displayToken.symbol}
                            </div>
                            <div className="text-xs text-primary font-medium">
                              {holdingPercentage}% of supply
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <h3 className="font-semibold mb-2">No holders yet</h3>
                    <p className="text-sm">Be the first to buy and claim your spot!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TokenDetail;