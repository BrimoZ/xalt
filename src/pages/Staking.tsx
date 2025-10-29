import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Coins, TrendingUp, Wallet, Gift, ArrowDownToLine, History, Heart, Users, Sparkles, ArrowRight, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const TOKEN_MINT = "EtEFsNoUmUaGGe8Bpi3GnUguJCndaW57G5X4BkvLpump";

const Staking = () => {
  const { user, isWalletConnected, profile } = useAuth();
  const { toast } = useToast();
  const [stakeAmount, setStakeAmount] = useState("");
  const [unstakeAmount, setUnstakeAmount] = useState("");
  
  const [walletBalance, setWalletBalance] = useState(0);
  const [stakedBalance, setStakedBalance] = useState(0);
  const [claimableRewards, setClaimableRewards] = useState(0);
  const [donationBalance, setDonationBalance] = useState(0);
  const [totalPoolSize, setTotalPoolSize] = useState(0);
  const [aprRate, setAprRate] = useState(150);
  const [isCheckingBalance, setIsCheckingBalance] = useState(false);
  const [nextRewardTime, setNextRewardTime] = useState(5 * 60);
  const [blockchainBalance, setBlockchainBalance] = useState(0);
  const [transactions, setTransactions] = useState<Array<{ id: string; transaction_type: string; amount: number; created_at: string }>>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch staking data from database
  const fetchStakingData = async () => {
    if (!user) return;
    
    try {
      const { data: stakingData, error: stakingError } = await supabase
        .from('staking')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (stakingError && stakingError.code !== 'PGRST116') {
        console.error('Error fetching staking data:', stakingError);
        return;
      }

      if (stakingData) {
        setStakedBalance(Number(stakingData.staked_amount) || 0);
        setClaimableRewards(Number(stakingData.claimable_rewards) || 0);
        setDonationBalance(Number(stakingData.donation_balance) || 0);
      }

      // Fetch pool config
      const { data: poolData, error: poolError } = await supabase
        .from('pool_config')
        .select('*')
        .single();

      if (poolError) {
        console.error('Error fetching pool config:', poolError);
      } else if (poolData) {
        setTotalPoolSize(Number(poolData.total_pool_size) || 0);
        setAprRate(Number(poolData.apr_rate) || 150);
        
        // Calculate next reward time based on last distribution
        if (poolData.last_reward_distribution) {
          const lastDistribution = new Date(poolData.last_reward_distribution).getTime();
          const now = Date.now();
          const timeSinceLastReward = Math.floor((now - lastDistribution) / 1000);
          const nextReward = (5 * 60) - (timeSinceLastReward % (5 * 60));
          setNextRewardTime(nextReward > 0 ? nextReward : 5 * 60);
        }
      }

      // Fetch recent transactions
      const { data: transData, error: transError } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (transError) {
        console.error('Error fetching transactions:', transError);
      } else if (transData) {
        setTransactions(transData);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Update wallet balance based on blockchain balance and staked amount
  useEffect(() => {
    const availableBalance = blockchainBalance - stakedBalance;
    setWalletBalance(availableBalance >= 0 ? availableBalance : 0);
  }, [blockchainBalance, stakedBalance]);

  // Fetch data on mount and when user changes
  useEffect(() => {
    if (user) {
      fetchStakingData();
    }
  }, [user]);

  // Real-time subscription for staking updates
  useEffect(() => {
    if (!user) return;

    const stakingChannel = supabase
      .channel('staking-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'staking',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Staking updated:', payload);
          const newData = payload.new as any;
          setStakedBalance(Number(newData.staked_amount) || 0);
          setClaimableRewards(Number(newData.claimable_rewards) || 0);
          setDonationBalance(Number(newData.donation_balance) || 0);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'pool_config'
        },
        (payload) => {
          console.log('Pool updated:', payload);
          const newData = payload.new as any;
          setTotalPoolSize(Number(newData.total_pool_size) || 0);
          setAprRate(Number(newData.apr_rate) || 150);
          
          // Recalculate countdown based on last distribution
          if (newData.last_reward_distribution) {
            const lastDistribution = new Date(newData.last_reward_distribution).getTime();
            const now = Date.now();
            const timeSinceLastReward = Math.floor((now - lastDistribution) / 1000);
            const nextReward = (5 * 60) - (timeSinceLastReward % (5 * 60));
            setNextRewardTime(nextReward > 0 ? nextReward : 5 * 60);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'transactions',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          // Refresh transactions when new one is added
          fetchStakingData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(stakingChannel);
    };
  }, [user]);

  // Check token balance from Solana blockchain via edge function
  const checkTokenBalance = async () => {
    if (!profile?.wallet_address || !isWalletConnected) return;
    setIsCheckingBalance(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('check-token-balance', {
        body: {
          walletAddress: profile.wallet_address,
          tokenMint: TOKEN_MINT
        }
      });

      if (error) throw error;

      const balance = data?.balance || 0;
      setBlockchainBalance(balance); // Store the blockchain balance
      
      if (balance > 0) {
        toast({
          title: "Balance Updated",
          description: `Total balance: ${balance.toFixed(2)} $FUND`,
        });
      }
    } catch (error: any) {
      console.error("Error checking token balance:", error);
      setBlockchainBalance(0);
      toast({
        title: "Balance Check Failed",
        description: error?.message || "Unable to fetch token balance from blockchain",
        variant: "destructive",
      });
    } finally {
      setIsCheckingBalance(false);
    }
  };

  // Countdown timer for next reward (syncs with server)
  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setNextRewardTime(prev => {
        if (prev <= 1) {
          // Refresh data when countdown reaches zero
          fetchStakingData();
          return 5 * 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, []);

  // Check balance on mount and when wallet connects
  useEffect(() => {
    if (isWalletConnected && profile?.wallet_address) {
      checkTokenBalance();
    }
  }, [isWalletConnected, profile?.wallet_address]);

  const handleStake = async () => {
    if (!user || !isWalletConnected) {
      toast({
        title: "Connect your wallet",
        description: "Please connect your wallet to stake tokens",
        variant: "destructive",
      });
      return;
    }

    if (!stakeAmount || parseFloat(stakeAmount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount to stake",
        variant: "destructive",
      });
      return;
    }

    const amount = parseFloat(stakeAmount);

    if (walletBalance === 0) {
      toast({
        title: "No available balance",
        description: "You don't have any tokens available to stake",
        variant: "destructive",
      });
      return;
    }

    if (amount > walletBalance) {
      toast({
        title: "Insufficient balance",
        description: `You only have ${walletBalance.toFixed(2)} $FUND available. You already have ${stakedBalance.toFixed(2)} staked.`,
        variant: "destructive",
      });
      return;
    }

    try {
      // Upsert staking record (use user_id for conflict resolution)
      const newStakedAmount = stakedBalance + amount;
      const { error: stakingError } = await supabase
        .from('staking')
        .upsert({
          user_id: user.id,
          wallet_address: profile?.wallet_address || '',
          staked_amount: newStakedAmount,
          claimable_rewards: claimableRewards,
          donation_balance: donationBalance
        }, {
          onConflict: 'user_id'
        });

      if (stakingError) throw stakingError;

      // Insert transaction record
      const { error: transError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          wallet_address: profile?.wallet_address || '',
          transaction_type: 'stake',
          amount: amount
        });

      if (transError) throw transError;

      // Update local state
      setStakedBalance(newStakedAmount);

      toast({
        title: "Tokens staked successfully!",
        description: `You've staked ${amount.toFixed(2)} $FUND at ${aprRate}% APR`,
      });
      setStakeAmount("");
      fetchStakingData(); // Refresh data
    } catch (error: any) {
      console.error('Error staking:', error);
      toast({
        title: "Staking failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleUnstake = async () => {
    if (!user || !isWalletConnected) {
      toast({
        title: "Connect your wallet",
        description: "Please connect your wallet to unstake tokens",
        variant: "destructive",
      });
      return;
    }

    if (!unstakeAmount || parseFloat(unstakeAmount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount to unstake",
        variant: "destructive",
      });
      return;
    }

    const amount = parseFloat(unstakeAmount);

    if (amount > stakedBalance) {
      toast({
        title: "Insufficient staked balance",
        description: `You only have ${stakedBalance.toFixed(2)} $FUND staked`,
        variant: "destructive",
      });
      return;
    }

    try {
      // Update staking record
      const newStakedAmount = stakedBalance - amount;
      const { error: stakingError } = await supabase
        .from('staking')
        .update({
          staked_amount: newStakedAmount
        })
        .eq('user_id', user.id);

      if (stakingError) throw stakingError;

      // Insert transaction record
      const { error: transError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          wallet_address: profile?.wallet_address || '',
          transaction_type: 'unstake',
          amount: amount
        });

      if (transError) throw transError;

      // Update local state
      setStakedBalance(newStakedAmount);

      toast({
        title: "Tokens unstaked successfully!",
        description: `You've unstaked ${amount.toFixed(2)} $FUND`,
      });
      setUnstakeAmount("");
      fetchStakingData(); // Refresh data
    } catch (error: any) {
      console.error('Error unstaking:', error);
      toast({
        title: "Unstaking failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleClaim = () => {
    if (!user || !isWalletConnected) {
      toast({
        title: "Connect your wallet",
        description: "Please connect your wallet to claim rewards",
        variant: "destructive",
      });
      return;
    }

    if (claimableRewards <= 0) {
      toast({
        title: "No rewards to claim",
        description: "You don't have any claimable rewards yet",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Rewards claimed successfully!",
      description: `You've claimed ${claimableRewards.toFixed(2)} tokens to your wallet`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Statistics Overview - First Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4 hover:border-primary/50 transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <TrendingUp className="w-4 h-4 text-primary" />
              </div>
              <span className="text-xs font-medium text-muted-foreground">APR</span>
            </div>
            <p className="text-2xl font-bold text-primary">{aprRate}%</p>
          </Card>

          <Card className="p-4 hover:border-primary/50 transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-accent/10">
                <Users className="w-4 h-4 text-accent" />
              </div>
              <span className="text-xs font-medium text-muted-foreground">Pool Size</span>
            </div>
            <p className="text-2xl font-bold">{totalPoolSize.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
          </Card>

          <Card className="p-4 hover:border-primary/50 transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Coins className="w-4 h-4 text-primary" />
              </div>
              <span className="text-xs font-medium text-muted-foreground">Your Stake</span>
            </div>
            <p className="text-2xl font-bold">{stakedBalance.toLocaleString()}</p>
          </Card>

          <Card className="p-4 hover:border-primary/50 transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-accent/10">
                <Wallet className="w-4 h-4 text-accent" />
              </div>
              <span className="text-xs font-medium text-muted-foreground">Wallet</span>
            </div>
            <p className="text-2xl font-bold">{walletBalance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
          </Card>
        </div>

        {/* Hero Card - Main Staking Interface */}
        <Card className="mb-6 overflow-hidden border-2">
          <div className="bg-gradient-to-br from-primary/5 via-accent/5 to-transparent p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left: Stake/Unstake Interface */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-primary/10">
                    <Coins className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Stake $FUND Tokens</h2>
                    <p className="text-sm text-muted-foreground">Earn rewards while making an impact</p>
                  </div>
                </div>

                <Tabs defaultValue="stake" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6 h-12">
                    <TabsTrigger value="stake" className="text-base">Stake</TabsTrigger>
                    <TabsTrigger value="unstake" className="text-base">Unstake</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="stake" className="space-y-4">
                    <div className="p-4 rounded-lg bg-background/80 backdrop-blur-sm border">
                      <div className="flex justify-between text-sm mb-3">
                        <span className="text-muted-foreground">Available Balance</span>
                        <span className="font-semibold">{walletBalance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} $FUND</span>
                      </div>
                      <div className="relative">
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={stakeAmount}
                          onChange={(e) => setStakeAmount(e.target.value)}
                          className="h-14 text-xl pr-24"
                        />
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-10"
                          onClick={() => setStakeAmount(walletBalance.toString())}
                        >
                          MAX
                        </Button>
                      </div>
                    </div>
                    <Button 
                      onClick={handleStake} 
                      className="w-full h-14 text-base"
                      disabled={!user || !isWalletConnected || isCheckingBalance}
                    >
                      <Sparkles className="w-5 h-5 mr-2" />
                      {isCheckingBalance ? "Checking Balance..." : "Stake Now"}
                    </Button>
                  </TabsContent>
                  
                  <TabsContent value="unstake" className="space-y-4">
                    <div className="p-4 rounded-lg bg-background/80 backdrop-blur-sm border">
                      <div className="flex justify-between text-sm mb-3">
                        <span className="text-muted-foreground">Staked Balance</span>
                        <span className="font-semibold">{stakedBalance.toLocaleString()} $FUND</span>
                      </div>
                      <div className="relative">
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={unstakeAmount}
                          onChange={(e) => setUnstakeAmount(e.target.value)}
                          className="h-14 text-xl pr-24"
                        />
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-10"
                          onClick={() => setUnstakeAmount(stakedBalance.toString())}
                        >
                          MAX
                        </Button>
                      </div>
                    </div>
                    <Button 
                      onClick={handleUnstake} 
                      variant="outline"
                      className="w-full h-14 text-base"
                      disabled={!user || !isWalletConnected || stakedBalance === 0}
                    >
                      <ArrowRight className="w-5 h-5 mr-2" />
                      Unstake
                    </Button>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Right: Rewards & Claim */}
              <div className="space-y-4">
                <div className="p-6 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border-2 border-primary/20">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Gift className="w-5 h-5 text-primary" />
                      <span className="text-sm font-medium">Claimable Rewards</span>
                    </div>
                    <Badge variant="outline" className="text-xs">50% Split</Badge>
                  </div>
                  <div className="text-4xl font-bold text-primary mb-2">
                    {claimableRewards.toFixed(2)} $FUND
                  </div>
                  <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>
                      Next reward in: {Math.floor(nextRewardTime / 60)}:{(nextRewardTime % 60).toString().padStart(2, '0')}
                    </span>
                  </div>
                  <Button 
                    onClick={handleClaim} 
                    className="w-full h-12"
                    disabled={true}
                  >
                    <ArrowDownToLine className="w-4 h-4 mr-2" />
                    Claim to Wallet
                  </Button>
                </div>

                <div className="p-6 rounded-xl bg-gradient-to-br from-accent/10 to-primary/10 border-2 border-accent/20">
                  <div className="flex items-center gap-2 mb-4">
                    <Heart className="w-5 h-5 text-accent" />
                    <span className="text-sm font-medium">Donation APR</span>
                  </div>
                  <div className="text-4xl font-bold text-accent mb-2">
                    {donationBalance.toFixed(2)} $FUND
                  </div>
                  <p className="text-xs text-muted-foreground">
                    50% of rewards available for you to donate
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Activity Section */}
        <Card>
          <CardHeader className="border-b">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-primary" />
              <CardTitle>Activity & History</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs defaultValue="transactions" className="w-full">
              <TabsList className="mb-6 h-11">
                <TabsTrigger value="transactions" className="px-6">
                  <History className="w-4 h-4 mr-2" />
                  Transactions
                </TabsTrigger>
                <TabsTrigger value="donations" className="px-6">
                  <Heart className="w-4 h-4 mr-2" />
                  Donations
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="transactions" className="space-y-3">
                {transactions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No transactions yet
                  </div>
                ) : (
                  transactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-5 rounded-xl border hover:bg-muted/30 transition-all">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          tx.transaction_type === 'stake' ? 'bg-primary/10 text-primary' :
                          tx.transaction_type === 'unstake' ? 'bg-muted text-muted-foreground' :
                          tx.transaction_type === 'reward' ? 'bg-accent/10 text-accent' :
                          'bg-primary/10 text-primary'
                        }`}>
                          {tx.transaction_type === 'stake' && <Coins className="w-6 h-6" />}
                          {tx.transaction_type === 'unstake' && <ArrowRight className="w-6 h-6" />}
                          {tx.transaction_type === 'reward' && <Gift className="w-6 h-6" />}
                          {tx.transaction_type === 'claim' && <ArrowDownToLine className="w-6 h-6" />}
                        </div>
                        <div>
                          <p className="font-semibold capitalize text-base">{tx.transaction_type}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(tx.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{Number(tx.amount).toFixed(4)} $FUND</p>
                      </div>
                    </div>
                  ))
                )}
              </TabsContent>
              
              <TabsContent value="donations" className="space-y-3">
                <div className="text-center py-8 text-muted-foreground">
                  Donation history coming soon
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default Staking;
