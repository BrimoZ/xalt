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
import { Coins, TrendingUp, Wallet, Gift, ArrowDownToLine, History, Heart, Users, Sparkles, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const Staking = () => {
  const { user, isXConnected } = useAuth();
  const { toast } = useToast();
  const [stakeAmount, setStakeAmount] = useState("");
  const [unstakeAmount, setUnstakeAmount] = useState("");
  
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
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Hero Section */}
        <div className="relative mb-12 overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-background to-accent/10 p-8 md:p-12 border border-primary/20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <Badge variant="outline" className="mb-4 bg-background/50 backdrop-blur-sm">
              <Sparkles className="w-3 h-3 mr-1" />
              Earn While You Give
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Staking Pool
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mb-6">
              Stake $GIVE tokens and earn {apr}% APR. Your rewards automatically split 50/50 — half for you to claim, half to fund projects you believe in.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 bg-background/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-border">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold">{apr}% APR</span>
              </div>
              <div className="flex items-center gap-2 bg-background/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-border">
                <Users className="w-4 h-4 text-accent" />
                <span className="text-sm font-semibold">{totalPoolSize.toLocaleString()} Total Staked</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          {/* Left: Balances (2 columns) */}
          <div className="xl:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Wallet Balance Card */}
            <Card className="relative overflow-hidden border-primary/30">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl"></div>
              <CardHeader className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Wallet className="w-6 h-6 text-primary" />
                  </div>
                  <Badge variant="outline">Main Wallet</Badge>
                </div>
                <CardTitle className="text-lg">Wallet Balance</CardTitle>
                <CardDescription>Available to stake</CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <p className="text-5xl font-bold mb-2">{walletBalance.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground mb-4">$GIVE tokens</p>
                
                <Separator className="my-4" />
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Currently Staked</span>
                    <span className="font-semibold">{stakedBalance.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Pool Share</span>
                    <span className="font-semibold text-primary">
                      {((stakedBalance / totalPoolSize) * 100).toFixed(2)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Donation Balance Card */}
            <Card className="relative overflow-hidden border-accent/30">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-2xl"></div>
              <CardHeader className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                    <Gift className="w-6 h-6 text-accent" />
                  </div>
                  <Badge variant="outline" className="border-accent/50">50% Rewards</Badge>
                </div>
                <CardTitle className="text-lg">Donation Balance</CardTitle>
                <CardDescription>Ready to fund projects</CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <p className="text-5xl font-bold text-accent mb-2">{donationBalance.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground mb-4">Auto-deposited from staking</p>
                
                <Separator className="my-4" />
                
                <Button 
                  variant="outline" 
                  className="w-full border-accent/50 hover:bg-accent/10"
                  onClick={() => window.location.href = '/'}
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Browse Pools
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* Claimable Rewards Card */}
            <Card className="md:col-span-2 relative overflow-hidden bg-gradient-to-br from-primary/5 to-background border-primary/30">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
              <CardHeader className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <ArrowDownToLine className="w-6 h-6 text-primary" />
                  </div>
                  <Badge variant="outline" className="border-primary/50">50% Rewards</Badge>
                </div>
                <CardTitle>Claimable Rewards</CardTitle>
                <CardDescription>Your share — withdraw to wallet anytime</CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-6xl font-bold text-primary mb-2">{claimableRewards.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground mb-6">$GIVE tokens ready to claim</p>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Daily Earnings</span>
                        <span className="font-semibold">
                          {stakedBalance ? (((stakedBalance * apr) / 365 / 100) / 2).toFixed(2) : "0.00"} / day
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Monthly Est.</span>
                        <span className="font-semibold">
                          {stakedBalance ? (((stakedBalance * apr) / 12 / 100) / 2).toFixed(2) : "0.00"} / month
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col justify-center">
                    <div className="bg-background/50 backdrop-blur-sm rounded-lg p-6 border border-primary/20 mb-4">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex-1">
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full" style={{ width: '50%' }}></div>
                          </div>
                        </div>
                        <span className="text-sm font-semibold text-primary">50%</span>
                      </div>
                      <p className="text-xs text-muted-foreground text-center">
                        Half of all rewards go to your wallet, half to donations
                      </p>
                    </div>
                    
                    <Button 
                      onClick={handleClaim} 
                      size="lg"
                      className="w-full"
                      disabled={!user || !isXConnected || claimableRewards <= 0}
                    >
                      <ArrowDownToLine className="w-4 h-4 mr-2" />
                      Claim {claimableRewards.toFixed(2)} Tokens
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Staking Actions */}
          <div className="space-y-6">
            {/* Stake Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Coins className="w-5 h-5 text-primary" />
                  Stake Tokens
                </CardTitle>
                <CardDescription>Lock tokens to start earning {apr}% APR</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Available</span>
                    <span className="font-semibold">{walletBalance.toLocaleString()} tokens</span>
                  </div>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={stakeAmount}
                      onChange={(e) => setStakeAmount(e.target.value)}
                      className="text-lg h-14 pr-20"
                    />
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      onClick={() => setStakeAmount(walletBalance.toString())}
                    >
                      Max
                    </Button>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">You will earn</span>
                    <span className="font-semibold text-primary">
                      {stakeAmount ? ((parseFloat(stakeAmount) * apr) / 100).toFixed(2) : "0.00"} / year
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Claimable (50%)</span>
                    <span className="font-semibold">
                      {stakeAmount ? (((parseFloat(stakeAmount) * apr) / 100) / 2).toFixed(2) : "0.00"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Donations (50%)</span>
                    <span className="font-semibold text-accent">
                      {stakeAmount ? (((parseFloat(stakeAmount) * apr) / 100) / 2).toFixed(2) : "0.00"}
                    </span>
                  </div>
                </div>

                <Button 
                  onClick={handleStake} 
                  className="w-full h-12"
                  disabled={!user || !isXConnected}
                >
                  <Coins className="w-4 h-4 mr-2" />
                  Stake Tokens
                </Button>
              </CardContent>
            </Card>

            {/* Unstake Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Coins className="w-5 h-5" />
                  Unstake Tokens
                </CardTitle>
                <CardDescription>Withdraw your staked tokens</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Staked</span>
                    <span className="font-semibold">{stakedBalance.toLocaleString()} tokens</span>
                  </div>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={unstakeAmount}
                      onChange={(e) => setUnstakeAmount(e.target.value)}
                      className="text-lg h-14 pr-20"
                    />
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      onClick={() => setUnstakeAmount(stakedBalance.toString())}
                    >
                      Max
                    </Button>
                  </div>
                </div>

                <Button 
                  onClick={handleUnstake} 
                  variant="outline"
                  className="w-full h-12"
                  disabled={!user || !isXConnected}
                >
                  Unstake Tokens
                </Button>
              </CardContent>
            </Card>

            {/* Info Card */}
            <Card className="bg-gradient-to-br from-accent/5 to-background border-accent/20">
              <CardHeader>
                <CardTitle className="text-lg">How It Works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold text-sm">1</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm mb-1">Stake Tokens</p>
                    <p className="text-xs text-muted-foreground">Lock $GIVE to earn {apr}% APR</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold text-sm">2</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm mb-1">Earn & Split</p>
                    <p className="text-xs text-muted-foreground">50% claimable, 50% donations</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-accent font-bold text-sm">3</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm mb-1">Fund Impact</p>
                    <p className="text-xs text-muted-foreground">Support projects automatically</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Activity Tabs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="w-5 h-5" />
              Activity History
            </CardTitle>
            <CardDescription>Track your staking transactions and donations</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="transactions" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="transactions" className="gap-2">
                  <Coins className="w-4 h-4" />
                  Transactions
                </TabsTrigger>
                <TabsTrigger value="donations" className="gap-2">
                  <Heart className="w-4 h-4" />
                  Donations
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="transactions" className="space-y-3">
                {transactions.length > 0 ? (
                  transactions.map((tx) => (
                    <div 
                      key={tx.id} 
                      className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
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
                        <p className="font-bold text-lg">{tx.amount.toLocaleString()}</p>
                        <Badge variant="outline" className="text-xs">{tx.status}</Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-16 text-muted-foreground">
                    <History className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <p className="text-lg font-semibold mb-2">No transactions yet</p>
                    <p className="text-sm">Start staking to see your transaction history</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="donations" className="space-y-3">
                {donations.length > 0 ? (
                  donations.map((donation) => (
                    <div 
                      key={donation.id} 
                      className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                          <Heart className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                          <p className="font-semibold">{donation.pool}</p>
                          <p className="text-sm text-muted-foreground">{donation.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-accent">{donation.amount}</p>
                        <p className="text-xs text-muted-foreground">tokens donated</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-16 text-muted-foreground">
                    <Heart className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <p className="text-lg font-semibold mb-2">No donations yet</p>
                    <p className="text-sm mb-6">Use your Donation Balance to support projects</p>
                    <Button variant="outline" onClick={() => window.location.href = '/'}>
                      <Heart className="w-4 h-4 mr-2" />
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
