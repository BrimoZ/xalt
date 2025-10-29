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
  const { user, isWalletConnected } = useAuth();
  const { toast } = useToast();
  const [stakeAmount, setStakeAmount] = useState("");
  const [unstakeAmount, setUnstakeAmount] = useState("");
  
  // Ready for real staking data - awaiting token contract address
  const [walletBalance] = useState(0);
  const [stakedBalance] = useState(0);
  const [claimableRewards] = useState(0);
  const [donationBalance] = useState(0);
  const [totalPoolSize] = useState(0);
  const apr = 0;

  // Transaction history - will be populated from blockchain
  const transactions: Array<{ id: number; type: string; amount: number; date: string; status: string }> = [];

  // Donation history - will be populated from blockchain
  const donations: Array<{ id: number; pool: string; amount: number; date: string }> = [];

  const handleStake = () => {
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

    toast({
      title: "Tokens staked successfully!",
      description: `You've staked ${stakeAmount} tokens at ${apr}% APR`,
    });
    setStakeAmount("");
  };

  const handleUnstake = () => {
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

    toast({
      title: "Tokens unstaked successfully!",
      description: `You've unstaked ${unstakeAmount} tokens`,
    });
    setUnstakeAmount("");
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
            <p className="text-2xl font-bold text-primary">{apr}%</p>
          </Card>

          <Card className="p-4 hover:border-primary/50 transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-accent/10">
                <Users className="w-4 h-4 text-accent" />
              </div>
              <span className="text-xs font-medium text-muted-foreground">Pool Size</span>
            </div>
            <p className="text-2xl font-bold">{totalPoolSize.toLocaleString()}</p>
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
            <p className="text-2xl font-bold">{walletBalance.toLocaleString()}</p>
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
                        <span className="font-semibold">{walletBalance.toLocaleString()} $FUND</span>
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
                      disabled={true}
                    >
                      <Sparkles className="w-5 h-5 mr-2" />
                      Stake Now
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
                      disabled={true}
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
                  <div className="text-4xl font-bold text-primary mb-6">
                    {claimableRewards.toFixed(2)} $FUND
                  </div>
                  <Button 
                    onClick={handleClaim} 
                    className="w-full h-12"
                    disabled={!user || !isWalletConnected || claimableRewards <= 0}
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
                {transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-5 rounded-xl border hover:bg-muted/30 transition-all">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        tx.type === 'stake' ? 'bg-primary/10 text-primary' :
                        tx.type === 'unstake' ? 'bg-muted text-muted-foreground' :
                        tx.type === 'reward' ? 'bg-accent/10 text-accent' :
                        'bg-primary/10 text-primary'
                      }`}>
                        {tx.type === 'stake' && <Coins className="w-6 h-6" />}
                        {tx.type === 'unstake' && <ArrowRight className="w-6 h-6" />}
                        {tx.type === 'reward' && <Gift className="w-6 h-6" />}
                        {tx.type === 'claim' && <ArrowDownToLine className="w-6 h-6" />}
                      </div>
                      <div>
                        <p className="font-semibold capitalize text-base">{tx.type}</p>
                        <p className="text-sm text-muted-foreground">{tx.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{tx.amount} $FUND</p>
                      <Badge variant="outline" className="text-xs mt-1">{tx.status}</Badge>
                    </div>
                  </div>
                ))}
              </TabsContent>
              
              <TabsContent value="donations" className="space-y-3">
                {donations.map((donation) => (
                  <div key={donation.id} className="flex items-center justify-between p-5 rounded-xl border hover:bg-accent/5 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                        <Heart className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <p className="font-semibold text-base">{donation.pool}</p>
                        <p className="text-sm text-muted-foreground">{donation.date}</p>
                      </div>
                    </div>
                    <p className="font-bold text-lg text-accent">+{donation.amount} $FUND</p>
                  </div>
                ))}
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
