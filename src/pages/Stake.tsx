import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Coins, TrendingUp, Wallet, Zap, Star, Trophy, Target } from "lucide-react";
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
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Top Section - Rabbit HUD */}
        <div className="mb-6">
          <div className="relative bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg p-4 border border-primary/20">
            <div className="flex items-center justify-between">
              {/* Left: Rabbit Character & Title */}
              <div className="flex items-center gap-4">
                <div className={`relative transition-all duration-500 ${totalStaked > 5000 ? 'text-4xl' : 'text-3xl'}`}>
                  🐰
                  {hasRewards && (
                    <div className="absolute -top-1 -right-1 text-sm animate-bounce">
                      🥕
                    </div>
                  )}
                </div>
                <h1 className="font-orbitron font-bold text-lg bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Rabbit Staking HUD
                </h1>
              </div>

              {/* Center: Compact Stats */}
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-xs text-muted-foreground mb-1">Wallet</div>
                  <div className="flex gap-3 text-sm">
                    <span className="font-mono font-bold text-primary">{userStats.walletRabbit.toFixed(0)}</span>
                    <span className="font-mono font-bold text-accent">{userStats.walletBunny.toFixed(0)}</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground mb-1">Staked</div>
                  <div className="flex gap-3 text-sm">
                    <span className="font-mono font-bold text-primary">{userStats.totalStakedRabbit.toLocaleString()}</span>
                    <span className="font-mono font-bold text-accent">{userStats.totalStakedBunny.toLocaleString()}</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground mb-1">Rewards</div>
                  <div className="flex gap-3 text-sm">
                    <span className="font-mono font-bold text-primary">{userStats.rewardsRabbit.toFixed(2)}</span>
                    <span className="font-mono font-bold text-accent">{userStats.rewardsBunny.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Right: Claim Button */}
              {hasRewards && (
                <Button 
                  className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-6 py-2 rounded-lg"
                  size="sm"
                >
                  <Star className="w-4 h-4 mr-2" />
                  Claim All
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Middle Section - Staking Pools */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Pool 1: Stake RABBIT → Earn BUNNY */}
          <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <div className="absolute top-0 right-0 w-20 h-20 text-4xl opacity-20">🐰</div>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Coins className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="font-orbitron">Stake $RABBIT</div>
                  <div className="text-sm text-muted-foreground font-normal">Earn $BUNNY</div>
                </div>
                <Badge variant="default" className="ml-auto">
                  {userStats.rabbitApr}% APR
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Currently Staked</span>
                  <div className="font-mono font-bold text-primary">{userStats.totalStakedRabbit.toLocaleString()} $RABBIT</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Rewards</span>
                  <div className="font-mono font-bold text-accent">{userStats.rewardsBunny.toFixed(2)} $BUNNY</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <Input
                  placeholder="Amount to stake/unstake"
                  value={rabbitStakeAmount}
                  onChange={(e) => setRabbitStakeAmount(e.target.value)}
                  className="font-mono"
                />
                <div className="flex gap-2">
                  <Button variant="cyber" className="flex-1">
                    Stake
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Unstake
                  </Button>
                  <Button variant="default" disabled={userStats.rewardsBunny === 0}>
                    Claim
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pool 2: Stake BUNNY → Earn RABBIT */}
          <Card className="relative overflow-hidden border-accent/20 bg-gradient-to-br from-accent/5 to-transparent">
            <div className="absolute top-0 right-0 w-20 h-20 text-4xl opacity-20">🐇</div>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <div className="font-orbitron">Stake $BUNNY</div>
                  <div className="text-sm text-muted-foreground font-normal">Earn $RABBIT</div>
                </div>
                <Badge variant="secondary" className="ml-auto">
                  {userStats.bunnyApr}% APR
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Currently Staked</span>
                  <div className="font-mono font-bold text-accent">{userStats.totalStakedBunny.toLocaleString()} $BUNNY</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Rewards</span>
                  <div className="font-mono font-bold text-primary">{userStats.rewardsRabbit.toFixed(2)} $RABBIT</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <Input
                  placeholder="Amount to stake/unstake"
                  value={bunnyStakeAmount}
                  onChange={(e) => setBunnyStakeAmount(e.target.value)}
                  className="font-mono"
                />
                <div className="flex gap-2">
                  <Button variant="cyber" className="flex-1">
                    Stake
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Unstake
                  </Button>
                  <Button variant="default" disabled={userStats.rewardsRabbit === 0}>
                    Claim
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Section - User Stats */}
        <div className="bg-card/30 backdrop-blur-sm rounded-2xl p-6 border border-border/50">
          <h2 className="font-orbitron font-bold text-xl mb-6 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            Your Staking Stats
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-primary/5 rounded-xl">
              <div className="text-2xl mb-2">🐰</div>
              <div className="text-sm text-muted-foreground mb-1">Total $RABBIT Staked</div>
              <div className="font-mono font-bold text-primary text-lg">{userStats.totalStakedRabbit.toLocaleString()}</div>
            </div>
            
            <div className="text-center p-4 bg-accent/5 rounded-xl">
              <div className="text-2xl mb-2">🐇</div>
              <div className="text-sm text-muted-foreground mb-1">Total $BUNNY Staked</div>
              <div className="font-mono font-bold text-accent text-lg">{userStats.totalStakedBunny.toLocaleString()}</div>
            </div>
            
            <div className="text-center p-4 bg-yellow-500/5 rounded-xl">
              <div className="text-2xl mb-2">💰</div>
              <div className="text-sm text-muted-foreground mb-1">Lifetime Rewards</div>
              <div className="font-mono font-bold text-yellow-600 text-lg">${userStats.lifetimeRewards.toFixed(2)}</div>
            </div>
            
            <div className="text-center p-4 bg-green-500/5 rounded-xl">
              <div className="text-2xl mb-2">📈</div>
              <div className="text-sm text-muted-foreground mb-1">Average APR</div>
              <div className="font-mono font-bold text-green-600 text-lg">
                {((userStats.rabbitApr + userStats.bunnyApr) / 2).toFixed(1)}%
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Stake;