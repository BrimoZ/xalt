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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[calc(100vh-12rem)]">
          {/* Left Sidebar - Stats & Info */}
          <div className="lg:col-span-4 space-y-6">
            {/* Header Card */}
            <Card className="bg-gradient-to-br from-primary/10 via-accent/5 to-background border-2">
              <CardContent className="pt-6 space-y-4">
                <div>
                  <Badge className="mb-3">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {apr}% APR
                  </Badge>
                  <h1 className="text-3xl font-bold mb-2">Staking Pool</h1>
                  <p className="text-sm text-muted-foreground">
                    Earn rewards while supporting the community
                  </p>
                </div>
                <Separator />
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Pooled</span>
                    <span className="font-semibold">{totalPoolSize.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Your Contribution</span>
                    <span className="font-semibold text-primary">{((stakedBalance / totalPoolSize) * 100).toFixed(2)}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Balances</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-primary/5">
                  <div className="flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-primary" />
                    <span className="text-sm">Wallet</span>
                  </div>
                  <span className="font-bold">{walletBalance.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-accent/5">
                  <div className="flex items-center gap-2">
                    <Coins className="w-4 h-4 text-accent" />
                    <span className="text-sm">Staked</span>
                  </div>
                  <span className="font-bold">{stakedBalance.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">Donated</span>
                  </div>
                  <span className="font-bold">{donationBalance.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Impact Card */}
            <Card className="border-accent/50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                    <Heart className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Impact</p>
                    <p className="text-2xl font-bold text-accent">{donationBalance.toFixed(2)}</p>
                  </div>
                </div>
                <Progress value={50} className="mb-2" />
                <p className="text-xs text-muted-foreground">50% of rewards donated automatically</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-6">
            {/* Rewards Banner */}
            <Card className="border-2 border-primary bg-gradient-to-r from-primary/5 to-accent/5">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="text-center md:text-left">
                    <p className="text-sm text-muted-foreground mb-1">Claimable Rewards</p>
                    <p className="text-5xl font-bold text-primary mb-2">{claimableRewards.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">$GIVE tokens ready to claim</p>
                  </div>
                  <div className="flex flex-col gap-2 w-full md:w-auto">
                    <Button 
                      onClick={handleClaim}
                      size="lg"
                      className="w-full md:w-48"
                      disabled={!user || !isXConnected || claimableRewards <= 0}
                    >
                      <ArrowDownToLine className="w-4 h-4 mr-2" />
                      Claim Now
                    </Button>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">
                        +{donationBalance.toFixed(2)} donated automatically
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Staking Interface */}
            <Card>
              <CardHeader>
                <CardTitle>Manage Your Stake</CardTitle>
                <CardDescription>Stake or unstake your tokens</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="stake" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="stake">Stake Tokens</TabsTrigger>
                    <TabsTrigger value="unstake">Unstake Tokens</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="stake" className="space-y-4">
                    <div className="p-4 rounded-lg bg-muted/50 space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Available to stake</span>
                        <span className="font-medium">{walletBalance.toLocaleString()} $GIVE</span>
                      </div>
                      <div className="relative">
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={stakeAmount}
                          onChange={(e) => setStakeAmount(e.target.value)}
                          className="h-14 text-xl pr-20"
                        />
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="absolute right-2 top-1/2 -translate-y-1/2 font-semibold"
                          onClick={() => setStakeAmount(walletBalance.toString())}
                        >
                          MAX
                        </Button>
                      </div>
                    </div>
                    <Button 
                      onClick={handleStake} 
                      className="w-full h-12"
                      disabled={!user || !isXConnected}
                    >
                      Stake Tokens
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </TabsContent>
                  
                  <TabsContent value="unstake" className="space-y-4">
                    <div className="p-4 rounded-lg bg-muted/50 space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Currently staked</span>
                        <span className="font-medium">{stakedBalance.toLocaleString()} $GIVE</span>
                      </div>
                      <div className="relative">
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={unstakeAmount}
                          onChange={(e) => setUnstakeAmount(e.target.value)}
                          className="h-14 text-xl pr-20"
                        />
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="absolute right-2 top-1/2 -translate-y-1/2 font-semibold"
                          onClick={() => setUnstakeAmount(stakedBalance.toString())}
                        >
                          MAX
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
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Activity Tabs */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="transactions" className="w-full">
                  <TabsList className="mb-4">
                    <TabsTrigger value="transactions">
                      <History className="w-4 h-4 mr-2" />
                      Transactions
                    </TabsTrigger>
                    <TabsTrigger value="donations">
                      <Heart className="w-4 h-4 mr-2" />
                      Donations
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="transactions" className="space-y-2">
                    {transactions.map((tx) => (
                      <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            tx.type === 'stake' ? 'bg-primary/10 text-primary' :
                            tx.type === 'unstake' ? 'bg-muted text-muted-foreground' :
                            tx.type === 'reward' ? 'bg-accent/10 text-accent' :
                            'bg-primary/10 text-primary'
                          }`}>
                            {tx.type === 'stake' && <Coins className="w-4 h-4" />}
                            {tx.type === 'unstake' && <Coins className="w-4 h-4" />}
                            {tx.type === 'reward' && <Gift className="w-4 h-4" />}
                            {tx.type === 'claim' && <ArrowDownToLine className="w-4 h-4" />}
                          </div>
                          <div>
                            <p className="font-medium text-sm capitalize">{tx.type}</p>
                            <p className="text-xs text-muted-foreground">{tx.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{tx.amount} $GIVE</p>
                          <Badge variant="outline" className="text-xs">{tx.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                  
                  <TabsContent value="donations" className="space-y-2">
                    {donations.map((donation) => (
                      <div key={donation.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/5 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                            <Heart className="w-4 h-4 text-accent" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{donation.pool}</p>
                            <p className="text-xs text-muted-foreground">{donation.date}</p>
                          </div>
                        </div>
                        <p className="font-semibold text-accent">{donation.amount} $GIVE</p>
                      </div>
                    ))}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Staking;
