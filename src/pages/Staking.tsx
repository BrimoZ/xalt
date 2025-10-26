import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Coins, TrendingUp, Wallet, Gift, ArrowDownToLine, History, Heart, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Staking = () => {
  const { user, isXConnected } = useAuth();
  const { toast } = useToast();
  const [stakeAmount, setStakeAmount] = useState("");
  const [unstakeAmount, setUnstakeAmount] = useState("");
  const [claimableAmount, setClaimableAmount] = useState("");
  
  // Mock data - replace with real data from your backend
  const [walletBalance] = useState(5000);
  const [stakedBalance] = useState(1000);
  const [claimableRewards] = useState(21.25); // 50% of total rewards
  const [donationBalance] = useState(21.25); // 50% of total rewards
  const [totalPoolSize] = useState(50000);
  const apr = 12.5;

  // Mock transaction history
  const transactions = [
    { id: 1, type: 'stake', amount: 500, date: '2025-01-20', status: 'completed' },
    { id: 2, type: 'reward', amount: 10.5, date: '2025-01-19', status: 'completed' },
    { id: 3, type: 'unstake', amount: 200, date: '2025-01-18', status: 'completed' },
    { id: 4, type: 'claim', amount: 8.75, date: '2025-01-17', status: 'completed' },
  ];

  // Mock donation history
  const donations = [
    { id: 1, pool: 'RabbitFi', amount: 15, date: '2025-01-20' },
    { id: 2, pool: 'BunnySwap', amount: 10, date: '2025-01-19' },
    { id: 3, pool: 'CarrotDAO', amount: 5, date: '2025-01-18' },
  ];

  const handleStake = () => {
    if (!user || !isXConnected) {
      toast({
        title: "Connect your account",
        description: "Please connect your X account to stake tokens",
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

    toast({
      title: "Tokens staked successfully!",
      description: `You've staked ${stakeAmount} tokens at ${apr}% APR`,
    });
    setStakeAmount("");
  };

  const handleUnstake = () => {
    if (!user || !isXConnected) {
      toast({
        title: "Connect your account",
        description: "Please connect your X account to unstake tokens",
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

    toast({
      title: "Tokens unstaked successfully!",
      description: `You've unstaked ${unstakeAmount} tokens`,
    });
    setUnstakeAmount("");
  };

  const handleClaim = () => {
    if (!user || !isXConnected) {
      toast({
        title: "Connect your account",
        description: "Please connect your X account to claim rewards",
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
      
      <main className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Staking Pool
          </h1>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            Stake your $GIVE tokens to earn APR. Your rewards are automatically split 50/50 — half for you to claim, half to your Donation Balance to fund projects you believe in.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Staking & Balances */}
          <div className="lg:col-span-2 space-y-6">
            {/* Staking Pool Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Coins className="w-6 h-6 text-primary" />
                  Staking Pool
                </CardTitle>
                <CardDescription>
                  Stake your tokens to earn {apr}% APR with automatic 50/50 reward split
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Pool Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">APR Rate</p>
                    <p className="text-3xl font-bold text-primary">{apr}%</p>
                  </div>
                  <div className="bg-card/50 border border-border rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">Total Pool Size</p>
                    <p className="text-3xl font-bold">{totalPoolSize.toLocaleString()}</p>
                  </div>
                </div>

                {/* Stake Section */}
                <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Stake Tokens</h3>
                    <span className="text-sm text-muted-foreground">
                      Available: {walletBalance.toLocaleString()} tokens
                    </span>
                  </div>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={stakeAmount}
                      onChange={(e) => setStakeAmount(e.target.value)}
                      className="text-lg pr-20"
                    />
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-7 text-xs"
                      onClick={() => setStakeAmount(walletBalance.toString())}
                    >
                      Max
                    </Button>
                  </div>
                  <Button onClick={handleStake} className="w-full" disabled={!user || !isXConnected}>
                    <Coins className="w-4 h-4 mr-2" />
                    Stake Tokens
                  </Button>
                </div>

                {/* Unstake Section */}
                <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Unstake Tokens</h3>
                    <span className="text-sm text-muted-foreground">
                      Staked: {stakedBalance.toLocaleString()} tokens
                    </span>
                  </div>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={unstakeAmount}
                      onChange={(e) => setUnstakeAmount(e.target.value)}
                      className="text-lg pr-20"
                    />
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-7 text-xs"
                      onClick={() => setUnstakeAmount(stakedBalance.toString())}
                    >
                      Max
                    </Button>
                  </div>
                  <Button onClick={handleUnstake} variant="outline" className="w-full" disabled={!user || !isXConnected}>
                    Unstake Tokens
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Balances Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Wallet Balance */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Wallet className="w-5 h-5 text-primary" />
                    Wallet Balance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-4xl font-bold text-foreground">{walletBalance.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground mt-1">$GIVE tokens available</p>
                  </div>
                  <div className="pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground mb-1">Currently Staked</p>
                    <p className="text-2xl font-semibold">{stakedBalance.toLocaleString()}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Donation Balance */}
              <Card className="border-accent/50">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Gift className="w-5 h-5 text-accent" />
                    Donation Balance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-4xl font-bold text-accent">{donationBalance.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground mt-1">50% of rewards - Ready to donate</p>
                  </div>
                  <Button variant="outline" className="w-full" onClick={() => window.location.href = '/'}>
                    <Heart className="w-4 h-4 mr-2" />
                    Browse Pools
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Column - Rewards & Info */}
          <div className="space-y-6">
            {/* Claimable Rewards */}
            <Card className="border-primary/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowDownToLine className="w-5 h-5 text-primary" />
                  Claimable Rewards
                </CardTitle>
                <CardDescription>
                  50% of your rewards — withdraw to wallet anytime
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 text-center">
                  <p className="text-5xl font-bold text-primary mb-2">{claimableRewards.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">$GIVE tokens</p>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Daily Rate</span>
                    <span className="font-semibold">
                      {stakedBalance ? (((stakedBalance * apr) / 365 / 100) / 2).toFixed(2) : "0.00"} tokens/day
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Your Share</span>
                    <span className="font-semibold text-primary">50%</span>
                  </div>
                </div>

                <Button onClick={handleClaim} className="w-full" disabled={!user || !isXConnected || claimableRewards <= 0}>
                  <ArrowDownToLine className="w-4 h-4 mr-2" />
                  Claim to Wallet
                </Button>
              </CardContent>
            </Card>

            {/* How It Works */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How Rewards Work</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-bold text-sm">1</span>
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Stake & Earn</p>
                      <p className="text-xs text-muted-foreground">Your tokens earn {apr}% APR</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-bold text-sm">2</span>
                    </div>
                    <div>
                      <p className="font-semibold text-sm">50/50 Split</p>
                      <p className="text-xs text-muted-foreground">Half claimable, half for donations</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-accent font-bold text-sm">3</span>
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Fund Projects</p>
                      <p className="text-xs text-muted-foreground">Use donation balance to support pools</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Activity Tabs */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="w-5 h-5" />
              Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="transactions" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="transactions">Transaction History</TabsTrigger>
                <TabsTrigger value="donations">Donation History</TabsTrigger>
              </TabsList>
              
              <TabsContent value="transactions" className="space-y-4 mt-4">
                {transactions.length > 0 ? (
                  <div className="space-y-2">
                    {transactions.map((tx) => (
                      <div key={tx.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            tx.type === 'stake' ? 'bg-primary/10' :
                            tx.type === 'reward' ? 'bg-accent/10' :
                            tx.type === 'unstake' ? 'bg-muted' :
                            'bg-primary/10'
                          }`}>
                            {tx.type === 'stake' && <Coins className="w-5 h-5 text-primary" />}
                            {tx.type === 'reward' && <TrendingUp className="w-5 h-5 text-accent" />}
                            {tx.type === 'unstake' && <Coins className="w-5 h-5 text-muted-foreground" />}
                            {tx.type === 'claim' && <ArrowDownToLine className="w-5 h-5 text-primary" />}
                          </div>
                          <div>
                            <p className="font-semibold capitalize">{tx.type}</p>
                            <p className="text-sm text-muted-foreground">{tx.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{tx.amount.toLocaleString()} tokens</p>
                          <Badge variant="outline" className="text-xs">{tx.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No transactions yet</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="donations" className="space-y-4 mt-4">
                {donations.length > 0 ? (
                  <div className="space-y-2">
                    {donations.map((donation) => (
                      <div key={donation.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                            <Heart className="w-5 h-5 text-accent" />
                          </div>
                          <div>
                            <p className="font-semibold">{donation.pool}</p>
                            <p className="text-sm text-muted-foreground">{donation.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-accent">{donation.amount} tokens</p>
                          <p className="text-xs text-muted-foreground">Donated</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Heart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No donations yet</p>
                    <Button variant="outline" className="mt-4" onClick={() => window.location.href = '/'}>
                      Browse Funding Pools
                    </Button>
                  </div>
                )}
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
