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
        {/* Gaming Style Split HUD */}
        <div className="mb-8">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left Side - Rabbit */}
            <div className="relative overflow-hidden bg-gradient-to-br from-orange-500/20 via-red-500/10 to-purple-600/20 rounded-2xl p-6 border border-orange-500/30 shadow-2xl">
              {/* Gaming Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-4 left-4 w-8 h-8 border-2 border-orange-500 rotate-45"></div>
                <div className="absolute top-8 right-8 w-6 h-6 border-2 border-red-500 rotate-12"></div>
                <div className="absolute bottom-8 left-8 w-4 h-4 border-2 border-purple-500 rotate-45"></div>
              </div>
              
              {/* Rabbit Character */}
              <div className="relative z-10 text-center mb-6">
                <div className="text-6xl mb-3 hover-scale animate-bounce">🐰</div>
                <h2 className="font-orbitron font-bold text-xl text-orange-400 mb-2">
                  $RABBIT ZONE
                </h2>
                <div className="text-sm text-muted-foreground">
                  Stake to earn $BUNNY
                </div>
              </div>
              
              {/* Rabbit Stats Grid */}
              <div className="relative z-10 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-black/30 rounded-lg p-3 border border-orange-500/20">
                    <div className="text-xs text-orange-300 mb-1">WALLET</div>
                    <div className="font-mono font-bold text-orange-400">1,251</div>
                  </div>
                  <div className="bg-black/30 rounded-lg p-3 border border-orange-500/20">
                    <div className="text-xs text-orange-300 mb-1">STAKED</div>
                    <div className="font-mono font-bold text-orange-400">5,000</div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-lg p-4 border border-orange-500/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-orange-300">REWARDS EARNED</span>
                    <Trophy className="w-4 h-4 text-yellow-400 animate-pulse" />
                  </div>
                  <div className="font-mono font-bold text-2xl text-yellow-400">125.75</div>
                  <div className="text-xs text-orange-300">$BUNNY tokens</div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-black/30 rounded-lg p-3 border border-orange-500/20 text-center">
                    <div className="text-xs text-orange-300 mb-1">APR</div>
                    <div className="font-mono font-bold text-green-400">45.2%</div>
                  </div>
                  <div className="bg-black/30 rounded-lg p-3 border border-orange-500/20 text-center">
                    <div className="text-xs text-orange-300 mb-1">STATUS</div>
                    <div className="text-xs text-green-400 font-bold">ACTIVE</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Side - Bunny */}
            <div className="relative overflow-hidden bg-gradient-to-br from-cyan-500/20 via-blue-500/10 to-indigo-600/20 rounded-2xl p-6 border border-cyan-500/30 shadow-2xl">
              {/* Gaming Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-4 right-4 w-8 h-8 border-2 border-cyan-500 rotate-45"></div>
                <div className="absolute top-8 left-8 w-6 h-6 border-2 border-blue-500 rotate-12"></div>
                <div className="absolute bottom-8 right-8 w-4 h-4 border-2 border-indigo-500 rotate-45"></div>
              </div>
              
              {/* Bunny Character */}
              <div className="relative z-10 text-center mb-6">
                <div className="text-6xl mb-3 hover-scale animate-pulse">🐇</div>
                <h2 className="font-orbitron font-bold text-xl text-cyan-400 mb-2">
                  $BUNNY ZONE
                </h2>
                <div className="text-sm text-muted-foreground">
                  Stake to earn $RABBIT
                </div>
              </div>
              
              {/* Bunny Stats Grid */}
              <div className="relative z-10 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-black/30 rounded-lg p-3 border border-cyan-500/20">
                    <div className="text-xs text-cyan-300 mb-1">WALLET</div>
                    <div className="font-mono font-bold text-cyan-400">890</div>
                  </div>
                  <div className="bg-black/30 rounded-lg p-3 border border-cyan-500/20">
                    <div className="text-xs text-cyan-300 mb-1">STAKED</div>
                    <div className="font-mono font-bold text-cyan-400">3,200</div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg p-4 border border-cyan-500/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-cyan-300">REWARDS EARNED</span>
                    <Trophy className="w-4 h-4 text-yellow-400 animate-pulse" />
                  </div>
                  <div className="font-mono font-bold text-2xl text-yellow-400">89.50</div>
                  <div className="text-xs text-cyan-300">$RABBIT tokens</div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-black/30 rounded-lg p-3 border border-cyan-500/20 text-center">
                    <div className="text-xs text-cyan-300 mb-1">APR</div>
                    <div className="font-mono font-bold text-green-400">38.7%</div>
                  </div>
                  <div className="bg-black/30 rounded-lg p-3 border border-cyan-500/20 text-center">
                    <div className="text-xs text-cyan-300 mb-1">STATUS</div>
                    <div className="text-xs text-green-400 font-bold">ACTIVE</div>
                  </div>
                </div>
              </div>
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
      </div>
      
      <Footer />
    </div>
  );
};

export default Stake;