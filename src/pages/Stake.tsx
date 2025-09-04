import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Coins, TrendingUp, Wallet, Zap, Star, Trophy, Target, ArrowUpRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Stake = () => {
  const [rabbitStakeAmount, setRabbitStakeAmount] = useState("");
  const [bunnyStakeAmount, setBunnyStakeAmount] = useState("");

  // Mock data - in real app this would come from context/API
  const userStats = {
    walletRabbit: 1250.50,
    walletBunny: 890.25,
    totalStakedRabbit: 5000,
    totalStakedBunny: 3200,
    rewardsRabbit: 125.75,
    rewardsBunny: 89.50,
    lifetimeRewards: 2450.80,
    rabbitApr: 45.2,
    bunnyApr: 38.7
  };

  const hasRewards = userStats.rewardsRabbit > 0 || userStats.rewardsBunny > 0;
  const totalStaked = userStats.totalStakedRabbit + userStats.totalStakedBunny;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section with large visual impact */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--primary)_0%,_transparent_50%)] opacity-5"></div>
        <div className="relative max-w-6xl mx-auto px-6 py-16 text-center">
          <div className="mb-8">
            <div className="inline-flex items-center gap-4 mb-6">
              <div className="text-6xl animate-bounce">🐰</div>
              <div className="text-2xl font-orbitron text-muted-foreground">×</div>
              <div className="text-6xl animate-pulse">🐇</div>
            </div>
            <h1 className="text-4xl md:text-6xl font-orbitron font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-4">
              Rabbit Burrow
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Hop into high-yield staking pools. Stake your tokens and watch your warren grow!
            </p>
          </div>
          
          {/* Quick Stats Cards */}
          <div className="grid md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <CardContent className="p-4 text-center">
                <Wallet className="w-6 h-6 text-primary mx-auto mb-2" />
                <div className="font-mono text-2xl font-bold text-foreground">{(userStats.walletRabbit + userStats.walletBunny).toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Portfolio Value</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
              <CardContent className="p-4 text-center">
                <Trophy className="w-6 h-6 text-accent mx-auto mb-2" />
                <div className="font-mono text-2xl font-bold text-foreground">{totalStaked.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Total Staked</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-border/50">
              <CardContent className="p-4 text-center">
                <Star className="w-6 h-6 text-primary mx-auto mb-2" />
                <div className="font-mono text-2xl font-bold text-foreground">{(userStats.rewardsRabbit + userStats.rewardsBunny).toFixed(2)}</div>
                <div className="text-sm text-muted-foreground">Pending Rewards</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-accent/5 to-primary/5 border-border/50">
              <CardContent className="p-4 text-center">
                <Target className="w-6 h-6 text-accent mx-auto mb-2" />
                <div className="font-mono text-2xl font-bold text-foreground">{userStats.lifetimeRewards.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Lifetime Earned</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Staking Interface */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Rabbit Pool */}
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="text-5xl mb-4 animate-bounce">🐰</div>
              <h2 className="text-3xl font-orbitron font-bold text-primary mb-2">$RABBIT Pool</h2>
              <p className="text-muted-foreground">Stake $RABBIT to earn $BUNNY rewards</p>
            </div>
            
            <Card className="relative overflow-hidden border-primary/30 bg-gradient-to-br from-primary/10 via-primary/5 to-background">
              <div className="absolute top-0 right-0 w-32 h-32 text-6xl opacity-10">🐰</div>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                      <Coins className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="font-orbitron text-xl">RABBIT Staking</div>
                      <div className="text-sm text-muted-foreground">Earn BUNNY tokens</div>
                    </div>
                  </div>
                  <Badge variant="default" className="text-lg px-3 py-1">
                    {userStats.rabbitApr}% APR
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-background/50 rounded-lg p-4 border border-primary/20">
                    <div className="text-sm text-muted-foreground mb-1">Your Wallet</div>
                    <div className="font-mono text-2xl font-bold text-primary">{userStats.walletRabbit.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">$RABBIT Available</div>
                  </div>
                  <div className="bg-background/50 rounded-lg p-4 border border-primary/20">
                    <div className="text-sm text-muted-foreground mb-1">Currently Staked</div>
                    <div className="font-mono text-2xl font-bold text-primary">{userStats.totalStakedRabbit.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">$RABBIT Staked</div>
                  </div>
                </div>
                
                {/* Rewards */}
                <div className="bg-gradient-to-r from-accent/10 to-accent/5 rounded-lg p-4 border border-accent/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Pending Rewards</span>
                    <ArrowUpRight className="w-4 h-4 text-accent" />
                  </div>
                  <div className="font-mono text-3xl font-bold text-accent">{userStats.rewardsBunny.toFixed(2)} $BUNNY</div>
                </div>
                
                {/* Staking Interface */}
                <div className="space-y-4">
                  <Input
                    placeholder="Enter RABBIT amount"
                    value={rabbitStakeAmount}
                    onChange={(e) => setRabbitStakeAmount(e.target.value)}
                    className="font-mono text-lg h-12 bg-background/50"
                  />
                  <div className="grid grid-cols-3 gap-3">
                    <Button variant="cyber" className="h-12">
                      Stake
                    </Button>
                    <Button variant="outline" className="h-12">
                      Unstake
                    </Button>
                    <Button 
                      variant="default" 
                      className="h-12" 
                      disabled={userStats.rewardsBunny === 0}
                    >
                      Claim
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bunny Pool */}
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="text-5xl mb-4 animate-pulse">🐇</div>
              <h2 className="text-3xl font-orbitron font-bold text-accent mb-2">$BUNNY Pool</h2>
              <p className="text-muted-foreground">Stake $BUNNY to earn $RABBIT rewards</p>
            </div>
            
            <Card className="relative overflow-hidden border-accent/30 bg-gradient-to-br from-accent/10 via-accent/5 to-background">
              <div className="absolute top-0 right-0 w-32 h-32 text-6xl opacity-10">🐇</div>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center">
                      <Zap className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <div className="font-orbitron text-xl">BUNNY Staking</div>
                      <div className="text-sm text-muted-foreground">Earn RABBIT tokens</div>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-lg px-3 py-1">
                    {userStats.bunnyApr}% APR
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-background/50 rounded-lg p-4 border border-accent/20">
                    <div className="text-sm text-muted-foreground mb-1">Your Wallet</div>
                    <div className="font-mono text-2xl font-bold text-accent">{userStats.walletBunny.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">$BUNNY Available</div>
                  </div>
                  <div className="bg-background/50 rounded-lg p-4 border border-accent/20">
                    <div className="text-sm text-muted-foreground mb-1">Currently Staked</div>
                    <div className="font-mono text-2xl font-bold text-accent">{userStats.totalStakedBunny.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">$BUNNY Staked</div>
                  </div>
                </div>
                
                {/* Rewards */}
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-4 border border-primary/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Pending Rewards</span>
                    <ArrowUpRight className="w-4 h-4 text-primary" />
                  </div>
                  <div className="font-mono text-3xl font-bold text-primary">{userStats.rewardsRabbit.toFixed(2)} $RABBIT</div>
                </div>
                
                {/* Staking Interface */}
                <div className="space-y-4">
                  <Input
                    placeholder="Enter BUNNY amount"
                    value={bunnyStakeAmount}
                    onChange={(e) => setBunnyStakeAmount(e.target.value)}
                    className="font-mono text-lg h-12 bg-background/50"
                  />
                  <div className="grid grid-cols-3 gap-3">
                    <Button variant="cyber" className="h-12">
                      Stake
                    </Button>
                    <Button variant="outline" className="h-12">
                      Unstake
                    </Button>
                    <Button 
                      variant="default" 
                      className="h-12" 
                      disabled={userStats.rewardsRabbit === 0}
                    >
                      Claim
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          <Card className="text-center p-6 bg-gradient-to-br from-primary/5 to-background border-primary/20">
            <TrendingUp className="w-8 h-8 text-primary mx-auto mb-4" />
            <h3 className="font-orbitron font-bold mb-2">High Yields</h3>
            <p className="text-sm text-muted-foreground">Earn up to 45% APR on your staked tokens with our optimized reward system.</p>
          </Card>
          
          <Card className="text-center p-6 bg-gradient-to-br from-accent/5 to-background border-accent/20">
            <Wallet className="w-8 h-8 text-accent mx-auto mb-4" />
            <h3 className="font-orbitron font-bold mb-2">Flexible Staking</h3>
            <p className="text-sm text-muted-foreground">Stake and unstake anytime with no lock-up periods. Your tokens, your choice.</p>
          </Card>
          
          <Card className="text-center p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-border/50">
            <Star className="w-8 h-8 text-primary mx-auto mb-4" />
            <h3 className="font-orbitron font-bold mb-2">Compound Rewards</h3>
            <p className="text-sm text-muted-foreground">Automatically compound your rewards to maximize your earnings over time.</p>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Stake;