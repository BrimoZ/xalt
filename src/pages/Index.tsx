import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Coins, TrendingUp, Zap, Star, Target, Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <div className="relative text-8xl">
                🐰
                <div className="absolute -top-2 -right-2 text-3xl animate-bounce">
                  🥕
                </div>
              </div>
            </div>
            <h1 className="font-orbitron font-bold text-5xl md:text-6xl mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Welcome to Rabbit Ecosystem
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Stake $RABBIT to earn $BUNNY, then grow your $BUNNY back into $RABBIT. 
              A symbiotic staking ecosystem where both tokens thrive together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="px-8 py-4 text-lg"
                onClick={() => navigate("/stake")}
              >
                <Zap className="w-5 h-5 mr-2" />
                Start Staking
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="px-8 py-4 text-lg"
                onClick={() => navigate("/how-it-works")}
              >
                Learn More
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6 bg-card/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-orbitron font-bold text-4xl mb-4">How the Ecosystem Works</h2>
            <p className="text-xl text-muted-foreground">A simple yet powerful dual-token staking system</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Stake RABBIT → Earn BUNNY */}
            <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-primary/10 to-transparent">
              <div className="absolute top-4 right-4 text-4xl opacity-30">🐰</div>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                    <Coins className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-orbitron text-xl">Stake $RABBIT</div>
                    <div className="text-sm text-muted-foreground font-normal">Earn $BUNNY rewards</div>
                  </div>
                  <Badge variant="default" className="ml-auto">
                    45.2% APR
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Lock your $RABBIT tokens in the staking pool and earn $BUNNY rewards. 
                  The longer you stake, the more $BUNNY you accumulate.
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>High APR rewards</span>
                </div>
              </CardContent>
            </Card>

            {/* Stake BUNNY → Earn RABBIT */}
            <Card className="relative overflow-hidden border-accent/20 bg-gradient-to-br from-accent/10 to-transparent">
              <div className="absolute top-4 right-4 text-4xl opacity-30">🐇</div>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <div className="font-orbitron text-xl">Stake $BUNNY</div>
                    <div className="text-sm text-muted-foreground font-normal">Earn $RABBIT rewards</div>
                  </div>
                  <Badge variant="secondary" className="ml-auto">
                    38.7% APR
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Grow your $BUNNY back into $RABBIT through our reverse staking pool. 
                  Create a sustainable cycle of rewards and growth.
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <Target className="w-4 h-4 text-green-500" />
                  <span>Compound growth potential</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-orbitron font-bold text-4xl mb-4">Ecosystem Stats</h2>
            <p className="text-xl text-muted-foreground">Real-time metrics from our staking pools</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-primary/5 rounded-xl border border-primary/20">
              <div className="text-3xl mb-3">🐰</div>
              <div className="text-2xl font-mono font-bold text-primary mb-2">2.5M</div>
              <div className="text-sm text-muted-foreground">Total $RABBIT Staked</div>
            </div>
            
            <div className="text-center p-6 bg-accent/5 rounded-xl border border-accent/20">
              <div className="text-3xl mb-3">🐇</div>
              <div className="text-2xl font-mono font-bold text-accent mb-2">1.8M</div>
              <div className="text-sm text-muted-foreground">Total $BUNNY Staked</div>
            </div>
            
            <div className="text-center p-6 bg-yellow-500/5 rounded-xl border border-yellow-500/20">
              <div className="text-3xl mb-3">💰</div>
              <div className="text-2xl font-mono font-bold text-yellow-600 mb-2">$425K</div>
              <div className="text-sm text-muted-foreground">Total Rewards Distributed</div>
            </div>
            
            <div className="text-center p-6 bg-green-500/5 rounded-xl border border-green-500/20">
              <div className="text-3xl mb-3">👥</div>
              <div className="text-2xl font-mono font-bold text-green-600 mb-2">3,247</div>
              <div className="text-sm text-muted-foreground">Active Stakers</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-6xl mb-6">🐰🥕🐇</div>
          <h2 className="font-orbitron font-bold text-4xl mb-6">Ready to Join the Rabbit Ecosystem?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Start staking today and become part of a thriving ecosystem where $RABBIT and $BUNNY work together to maximize your rewards.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="px-8 py-4 text-lg"
              onClick={() => navigate("/stake")}
            >
              <Wallet className="w-5 h-5 mr-2" />
              Connect & Stake
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="px-8 py-4 text-lg"
              onClick={() => navigate("/how-it-works")}
            >
              View Documentation
            </Button>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
