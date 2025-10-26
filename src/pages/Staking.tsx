import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Coins, TrendingUp, Wallet, Gift } from "lucide-react";

const Staking = () => {
  const { user, isXConnected } = useAuth();
  const { toast } = useToast();
  const [stakeAmount, setStakeAmount] = useState("");
  const [unstakeAmount, setUnstakeAmount] = useState("");
  
  // Mock data - replace with real data from your backend
  const [stakedBalance] = useState(1000);
  const [donationBalance] = useState(42.5);
  const [totalPoolSize] = useState(50000);
  const apr = 12.5;

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

    // TODO: Implement actual staking logic with backend
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

    // TODO: Implement actual unstaking logic with backend
    toast({
      title: "Tokens unstaked successfully!",
      description: `You've unstaked ${unstakeAmount} tokens`,
    });
    setUnstakeAmount("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Staking Pool
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Stake your $GIVE tokens to earn APR. Your rewards are automatically split 50/50 — half for you to claim, half to your Donation Balance to fund projects you believe in.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                APR Rate
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{apr}%</div>
              <p className="text-xs text-muted-foreground mt-1">Annual Percentage Rate</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <Coins className="w-4 h-4" />
                Total Pool Size
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalPoolSize.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Tokens staked</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <Gift className="w-4 h-4" />
                Donation Balance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">{donationBalance.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">Available for donations</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Staking Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Stake Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="w-5 h-5" />
                Stake Tokens
              </CardTitle>
              <CardDescription>
                Stake your tokens and earn rewards split 50/50 between claimable yield and your Donation Balance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Amount to Stake</label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  className="text-lg"
                />
                <p className="text-xs text-muted-foreground">
                  Available: 5,000 tokens
                </p>
              </div>

              <div className="p-4 bg-muted rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">APR</span>
                  <span className="font-semibold text-primary">{apr}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Estimated Daily Rewards</span>
                  <span className="font-semibold">
                    {stakeAmount ? ((parseFloat(stakeAmount) * apr) / 365 / 100).toFixed(2) : "0.00"} tokens
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Your Claimable (50%)</span>
                  <span className="font-semibold text-primary">
                    {stakeAmount ? (((parseFloat(stakeAmount) * apr) / 365 / 100) / 2).toFixed(2) : "0.00"} tokens/day
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Donation Balance (50%)</span>
                  <span className="font-semibold text-accent">
                    {stakeAmount ? (((parseFloat(stakeAmount) * apr) / 365 / 100) / 2).toFixed(2) : "0.00"} tokens/day
                  </span>
                </div>
              </div>

              <Button 
                onClick={handleStake} 
                className="w-full"
                disabled={!user || !isXConnected}
              >
                <Coins className="w-4 h-4 mr-2" />
                Stake Now
              </Button>
            </CardContent>
          </Card>

          {/* Unstake & Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="w-5 h-5" />
                Your Staking Position
              </CardTitle>
              <CardDescription>
                Manage your staked tokens and view your rewards
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Your Staked Balance</p>
                  <p className="text-3xl font-bold">{stakedBalance.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {((stakedBalance / totalPoolSize) * 100).toFixed(2)}% of total pool
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Accumulated Rewards</span>
                    <span className="font-semibold text-accent">{donationBalance.toFixed(2)} tokens</span>
                  </div>
                  <Progress value={(donationBalance / 100) * 100} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    Rewards are automatically added to your Donation Balance
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Amount to Unstake</label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={unstakeAmount}
                  onChange={(e) => setUnstakeAmount(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Staked: {stakedBalance.toLocaleString()} tokens
                </p>
              </div>

              <Button 
                onClick={handleUnstake} 
                variant="outline"
                className="w-full"
                disabled={!user || !isXConnected}
              >
                Unstake Tokens
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* How it Works Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>How Staking Works</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                1
              </div>
              <h3 className="font-semibold">Stake Your Tokens</h3>
              <p className="text-sm text-muted-foreground">
                Lock your tokens in the staking pool to start earning rewards at {apr}% APR
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                2
              </div>
              <h3 className="font-semibold">Earn Rewards — Split with Purpose</h3>
              <p className="text-sm text-muted-foreground">
                Your rewards are automatically split 50/50: half claimable for you, half to your Donation Balance to fund others
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                3
              </div>
              <h3 className="font-semibold">Support Projects You Believe In</h3>
              <p className="text-sm text-muted-foreground">
                Browse funding pools and use your Donation Balance to support causes that matter to you
              </p>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default Staking;
