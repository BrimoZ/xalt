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
        {/* Statistics Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">APR</span>
                <TrendingUp className="w-4 h-4 text-primary" />
              </div>
              <p className="text-3xl font-bold text-primary">{apr}%</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Total Pool</span>
                <Users className="w-4 h-4 text-muted-foreground" />
              </div>
              <p className="text-3xl font-bold">{totalPoolSize.toLocaleString()}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Your Stake</span>
                <Coins className="w-4 h-4 text-primary" />
              </div>
              <p className="text-3xl font-bold">{stakedBalance.toLocaleString()}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Claimable</span>
                <Gift className="w-4 h-4 text-accent" />
              </div>
              <p className="text-3xl font-bold text-accent">{claimableRewards.toFixed(2)}</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Left: Staking Pool */}
          <Card>
            <CardHeader>
              <CardTitle>Staking Pool</CardTitle>
              <CardDescription>Stake or unstake your tokens</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="stake" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="stake">Stake</TabsTrigger>
                  <TabsTrigger value="unstake">Unstake</TabsTrigger>
                </TabsList>
                
                <TabsContent value="stake" className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-3">
                      <span className="text-muted-foreground">Available</span>
                      <span className="font-medium">{walletBalance.toLocaleString()} $GIVE</span>
                    </div>
                    <div className="relative">
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={stakeAmount}
                        onChange={(e) => setStakeAmount(e.target.value)}
                        className="h-12 text-lg pr-20"
                      />
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2"
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
                  </Button>
                </TabsContent>
                
                <TabsContent value="unstake" className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-3">
                      <span className="text-muted-foreground">Staked</span>
                      <span className="font-medium">{stakedBalance.toLocaleString()} $GIVE</span>
                    </div>
                    <div className="relative">
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={unstakeAmount}
                        onChange={(e) => setUnstakeAmount(e.target.value)}
                        className="h-12 text-lg pr-20"
                      />
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2"
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

          {/* Right: Balances & Staking Data */}
          <div className="space-y-6">
            {/* Balances */}
            <Card>
              <CardHeader>
                <CardTitle>Balances</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                  <div className="flex items-center gap-2">
                    <Wallet className="w-4 h-4" />
                    <span className="text-sm">Wallet</span>
                  </div>
                  <span className="font-bold">{walletBalance.toLocaleString()} $GIVE</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                  <div className="flex items-center gap-2">
                    <Coins className="w-4 h-4" />
                    <span className="text-sm">Staked</span>
                  </div>
                  <span className="font-bold">{stakedBalance.toLocaleString()} $GIVE</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    <span className="text-sm">Donations</span>
                  </div>
                  <span className="font-bold">{donationBalance.toFixed(2)} $GIVE</span>
                </div>
              </CardContent>
            </Card>

            {/* Staking Data */}
            <Card>
              <CardHeader>
                <CardTitle>Staking Data</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Claimable Rewards</span>
                  <span className="font-bold text-primary">{claimableRewards.toFixed(2)} $GIVE</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">To Donations (50%)</span>
                  <span className="font-bold text-accent">{donationBalance.toFixed(2)} $GIVE</span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t">
                  <span className="text-sm text-muted-foreground">Total Earned</span>
                  <span className="font-bold">{(claimableRewards + donationBalance).toFixed(2)} $GIVE</span>
                </div>
                <Button 
                  onClick={handleClaim} 
                  className="w-full h-12"
                  disabled={!user || !isXConnected || claimableRewards <= 0}
                >
                  <ArrowDownToLine className="w-4 h-4 mr-2" />
                  Claim Rewards
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Transactions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="transactions" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="transactions">
                  <History className="w-4 h-4 mr-2" />
                  All Transactions
                </TabsTrigger>
                <TabsTrigger value="donations">
                  <Heart className="w-4 h-4 mr-2" />
                  Donations
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="transactions">
                <div className="space-y-2">
                  {transactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          tx.type === 'stake' ? 'bg-primary/10 text-primary' :
                          tx.type === 'unstake' ? 'bg-muted text-muted-foreground' :
                          tx.type === 'reward' ? 'bg-accent/10 text-accent' :
                          'bg-primary/10 text-primary'
                        }`}>
                          {tx.type === 'stake' && <Coins className="w-5 h-5" />}
                          {tx.type === 'unstake' && <Coins className="w-5 h-5" />}
                          {tx.type === 'reward' && <Gift className="w-5 h-5" />}
                          {tx.type === 'claim' && <ArrowDownToLine className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className="font-medium capitalize">{tx.type}</p>
                          <p className="text-sm text-muted-foreground">{tx.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-lg">{tx.amount} $GIVE</p>
                        <Badge variant="outline" className="text-xs mt-1">{tx.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="donations">
                <div className="space-y-2">
                  {donations.map((donation) => (
                    <div key={donation.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/5 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                          <Heart className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                          <p className="font-medium">{donation.pool}</p>
                          <p className="text-sm text-muted-foreground">{donation.date}</p>
                        </div>
                      </div>
                      <p className="font-semibold text-lg text-accent">{donation.amount} $GIVE</p>
                    </div>
                  ))}
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
