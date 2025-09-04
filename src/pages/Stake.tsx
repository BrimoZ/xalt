import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Coins, TrendingUp, Zap } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Stake = () => {
  const [rabbitStakeAmount, setRabbitStakeAmount] = useState("");
  const [bunnyStakeAmount, setBunnyStakeAmount] = useState("");

  // Mock data
  const userStats = {
    walletRabbit: 1250.50,
    walletBunny: 890.25,
    totalStakedRabbit: 5000,
    totalStakedBunny: 3200,
    rewardsRabbit: 125.75,
    rewardsBunny: 89.50,
    rabbitApr: 45.2,
    bunnyApr: 38.7
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Centered Content */}
      <div className="flex items-center justify-center min-h-[80vh] px-6 py-12">
        <div className="w-full max-w-4xl">
          
          {/* Minimal Header */}
          <div className="text-center mb-16">
            <div className="text-6xl mb-6 animate-float">🐰</div>
            <h1 className="font-mono text-2xl font-bold text-foreground mb-4">
              Staking Vault
            </h1>
            <p className="text-muted-foreground">
              Stake your tokens to earn rewards
            </p>
          </div>

          {/* Simple Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <div className="text-center">
              <div className="text-lg font-mono font-bold text-foreground mb-1">
                {userStats.walletRabbit.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Wallet $RABBIT</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-mono font-bold text-foreground mb-1">
                {userStats.walletBunny.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Wallet $BUNNY</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-mono font-bold text-primary mb-1">
                {userStats.totalStakedRabbit.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Staked $RABBIT</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-mono font-bold text-primary mb-1">
                {userStats.totalStakedBunny.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Staked $BUNNY</div>
            </div>
          </div>

          {/* Staking Pools */}
          <div className="grid md:grid-cols-2 gap-8">
            
            {/* RABBIT Pool */}
            <Card className="border-border bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Coins className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-mono text-lg">$RABBIT</div>
                      <div className="text-sm text-muted-foreground font-normal">Earn $BUNNY</div>
                    </div>
                  </div>
                  <Badge variant="outline" className="border-primary/20 text-primary">
                    {userStats.rabbitApr}% APR
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-4">
                  <div className="text-2xl font-mono font-bold text-primary mb-1">
                    {userStats.totalStakedRabbit.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Currently Staked</div>
                  <div className="text-lg font-mono text-accent mt-2">
                    {userStats.rewardsBunny.toFixed(2)} $BUNNY rewards
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Input
                    placeholder="Amount to stake"
                    value={rabbitStakeAmount}
                    onChange={(e) => setRabbitStakeAmount(e.target.value)}
                    className="font-mono bg-muted/50 border-border"
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <Button size="sm" className="bg-primary hover:bg-primary/90">
                      Stake
                    </Button>
                    <Button size="sm" variant="outline" className="border-border">
                      Unstake
                    </Button>
                    <Button size="sm" variant="outline" className="border-primary/20 text-primary" disabled={userStats.rewardsBunny === 0}>
                      Claim
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* BUNNY Pool */}
            <Card className="border-border bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <div className="font-mono text-lg">$BUNNY</div>
                      <div className="text-sm text-muted-foreground font-normal">Earn $RABBIT</div>
                    </div>
                  </div>
                  <Badge variant="outline" className="border-accent/20 text-accent">
                    {userStats.bunnyApr}% APR
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-4">
                  <div className="text-2xl font-mono font-bold text-accent mb-1">
                    {userStats.totalStakedBunny.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Currently Staked</div>
                  <div className="text-lg font-mono text-primary mt-2">
                    {userStats.rewardsRabbit.toFixed(2)} $RABBIT rewards
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Input
                    placeholder="Amount to stake"
                    value={bunnyStakeAmount}
                    onChange={(e) => setBunnyStakeAmount(e.target.value)}
                    className="font-mono bg-muted/50 border-border"
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <Button size="sm" className="bg-accent hover:bg-accent/90">
                      Stake
                    </Button>
                    <Button size="sm" variant="outline" className="border-border">
                      Unstake
                    </Button>
                    <Button size="sm" variant="outline" className="border-accent/20 text-accent" disabled={userStats.rewardsRabbit === 0}>
                      Claim
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Stake;