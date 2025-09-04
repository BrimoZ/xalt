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
        {/* Compact Gaming HUD */}
        <div className="mb-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Side - Rabbit */}
            <div className="relative bg-gradient-to-br from-amber-600/15 to-orange-700/10 rounded-xl p-4 border border-amber-500/25">
              <div className="flex items-center gap-3 mb-3">
                <div className="text-3xl animate-bounce">🐰</div>
                <div>
                  <h3 className="font-orbitron font-bold text-amber-400 text-sm">$RABBIT</h3>
                  <p className="text-xs text-muted-foreground">Earn $BUNNY</p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="bg-black/20 rounded p-2 text-center">
                  <div className="text-xs text-amber-300">Wallet</div>
                  <div className="font-mono text-sm text-amber-400">1.2K</div>
                </div>
                <div className="bg-black/20 rounded p-2 text-center">
                  <div className="text-xs text-amber-300">Staked</div>
                  <div className="font-mono text-sm text-amber-400">5.0K</div>
                </div>
                <div className="bg-black/20 rounded p-2 text-center">
                  <div className="text-xs text-amber-300">APR</div>
                  <div className="font-mono text-sm text-green-400">45%</div>
                </div>
              </div>
              
              <div className="bg-amber-500/10 rounded-lg p-2 border border-amber-500/20">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-amber-300">Rewards</span>
                  <span className="font-mono text-lg text-yellow-400">125.75</span>
                </div>
              </div>
            </div>
            
            {/* Right Side - Bunny */}
            <div className="relative bg-gradient-to-br from-sky-600/15 to-blue-700/10 rounded-xl p-4 border border-sky-500/25">
              <div className="flex items-center gap-3 mb-3">
                <div className="text-3xl animate-pulse">🐇</div>
                <div>
                  <h3 className="font-orbitron font-bold text-sky-400 text-sm">$BUNNY</h3>
                  <p className="text-xs text-muted-foreground">Earn $RABBIT</p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="bg-black/20 rounded p-2 text-center">
                  <div className="text-xs text-sky-300">Wallet</div>
                  <div className="font-mono text-sm text-sky-400">890</div>
                </div>
                <div className="bg-black/20 rounded p-2 text-center">
                  <div className="text-xs text-sky-300">Staked</div>
                  <div className="font-mono text-sm text-sky-400">3.2K</div>
                </div>
                <div className="bg-black/20 rounded p-2 text-center">
                  <div className="text-xs text-sky-300">APR</div>
                  <div className="font-mono text-sm text-green-400">39%</div>
                </div>
              </div>
              
              <div className="bg-sky-500/10 rounded-lg p-2 border border-sky-500/20">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-sky-300">Rewards</span>
                  <span className="font-mono text-lg text-yellow-400">89.50</span>
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