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
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Staking Pool</h1>
          <p className="text-muted-foreground">
            Stake $GIVE tokens to earn {apr}% APR. Rewards split 50/50 between you and donations.
          </p>
        </div>

        {/* Staking Pool Stats */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Pool Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">APR</p>
                <p className="text-3xl font-bold text-primary">{apr}%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Staked</p>
                <p className="text-3xl font-bold">{totalPoolSize.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Your Staked</p>
                <p className="text-3xl font-bold">{stakedBalance.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Wallet Balance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="w-5 h-5" />
                Wallet Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold mb-4">{walletBalance.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">$GIVE tokens</p>
            </CardContent>
          </Card>

          {/* Donation Balance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="w-5 h-5" />
                Donation Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold mb-4 text-accent">{donationBalance.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground mb-4">Auto-deposited from rewards</p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.location.href = '/'}
              >
                Browse Pools
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Stake/Unstake & Rewards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Stake */}
          <Card>
            <CardHeader>
              <CardTitle>Stake Tokens</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Available</span>
                  <span>{walletBalance.toLocaleString()}</span>
                </div>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                  />
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-7"
                    onClick={() => setStakeAmount(walletBalance.toString())}
                  >
                    Max
                  </Button>
                </div>
              </div>
              <Button 
                onClick={handleStake} 
                className="w-full"
                disabled={!user || !isXConnected}
              >
                Stake
              </Button>
            </CardContent>
          </Card>

          {/* Unstake */}
          <Card>
            <CardHeader>
              <CardTitle>Unstake Tokens</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Staked</span>
                  <span>{stakedBalance.toLocaleString()}</span>
                </div>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={unstakeAmount}
                    onChange={(e) => setUnstakeAmount(e.target.value)}
                  />
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-7"
                    onClick={() => setUnstakeAmount(stakedBalance.toString())}
                  >
                    Max
                  </Button>
                </div>
              </div>
              <Button 
                onClick={handleUnstake} 
                variant="outline"
                className="w-full"
                disabled={!user || !isXConnected}
              >
                Unstake
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Claimable Rewards */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowDownToLine className="w-5 h-5" />
              Claimable Rewards
            </CardTitle>
            <CardDescription>Your 50% share of staking rewards</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-5xl font-bold text-primary mb-2">{claimableRewards.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">$GIVE tokens</p>
              </div>
              <Button 
                onClick={handleClaim} 
                size="lg"
                disabled={!user || !isXConnected || claimableRewards <= 0}
              >
                Claim Rewards
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Activity Tabs */}
        <Tabs defaultValue="transactions" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="transactions">
              <History className="w-4 h-4 mr-2" />
              Transactions
            </TabsTrigger>
            <TabsTrigger value="donations">
              <Heart className="w-4 h-4 mr-2" />
              Donations
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between py-2 border-b last:border-0">
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
                          <p className="font-medium capitalize">{tx.type}</p>
                          <p className="text-sm text-muted-foreground">{tx.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{tx.amount} $GIVE</p>
                        <Badge variant="outline" className="text-xs">{tx.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="donations">
            <Card>
              <CardHeader>
                <CardTitle>Donation History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {donations.map((donation) => (
                    <div key={donation.id} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                          <Heart className="w-4 h-4 text-accent" />
                        </div>
                        <div>
                          <p className="font-medium">{donation.pool}</p>
                          <p className="text-sm text-muted-foreground">{donation.date}</p>
                        </div>
                      </div>
                      <p className="font-semibold text-accent">{donation.amount} $GIVE</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default Staking;
