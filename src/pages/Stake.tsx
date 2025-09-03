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
        {/* Redesigned Rabbit Staking HUD */}
        <div className="mb-8">
          <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 rounded-2xl p-8 border border-primary/30">
            {/* Floating background elements */}
            <div className="absolute top-4 right-8 text-6xl opacity-10 animate-pulse">🐰</div>
            <div className="absolute bottom-4 left-8 text-4xl opacity-10 animate-bounce" style={{ animationDelay: '1s' }}>🐇</div>
            <div className="absolute top-1/2 right-20 text-2xl opacity-5 animate-spin" style={{ animationDuration: '20s' }}>🥕</div>
            
            {/* Main HUD Content */}
            <div className="relative z-10 flex items-center justify-center">
              <div className="text-center space-y-4">
                {/* Animated Rabbit Character */}
                <div className="flex items-center justify-center gap-3">
                  <div className={`text-5xl transition-all duration-700 ${totalStaked > 5000 ? 'scale-110' : 'scale-100'}`}>
                    🐰
                  </div>
                  <div className="text-2xl animate-bounce" style={{ animationDelay: '0.5s' }}>
                    ↔️
                  </div>
                  <div className="text-5xl animate-pulse" style={{ animationDelay: '1s' }}>
                    🐇
                  </div>
                </div>
                
                {/* Title */}
                <h1 className="font-orbitron font-bold text-3xl bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient">
                  RABBIT ECOSYSTEM
                </h1>
                
                {/* Subtitle */}
                <p className="text-muted-foreground text-lg max-w-md mx-auto">
                  Stake • Earn • Grow • Repeat
                </p>
                
                {/* Ecosystem Flow */}
                <div className="flex items-center justify-center gap-4 mt-6 p-4 bg-background/50 rounded-lg backdrop-blur-sm">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-primary font-bold">$RABBIT</span>
                    <span className="text-muted-foreground">→</span>
                    <span className="text-accent font-bold">$BUNNY</span>
                  </div>
                  <div className="w-px h-6 bg-border"></div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-accent font-bold">$BUNNY</span>
                    <span className="text-muted-foreground">→</span>
                    <span className="text-primary font-bold">$RABBIT</span>
                  </div>
                </div>
                
                {/* Action Button */}
                {hasRewards && (
                  <Button 
                    className="bg-gradient-to-r from-primary to-accent hover:from-primary/80 hover:to-accent/80 text-primary-foreground font-bold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                    size="lg"
                  >
                    <Star className="w-5 h-5 mr-2 animate-pulse" />
                    Claim All Rewards
                  </Button>
                )}
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