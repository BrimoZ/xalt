import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute -top-8 -left-8 text-7xl opacity-10 select-none">🐰</div>
        <div className="absolute -bottom-10 -right-6 text-7xl opacity-10 select-none">🐇</div>
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex justify-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full border border-primary/30 bg-primary/10 font-mono text-xs">🐰 $RABBIT</span>
            <span className="px-3 py-1 rounded-full border border-accent/30 bg-accent/10 font-mono text-xs">🐇 $BUNNY</span>
          </div>
          <h1 className="font-orbitron font-bold text-5xl md:text-6xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
            Rabbit × Bunny Ecosystem
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Stake $RABBIT to earn $BUNNY — stake $BUNNY to earn $RABBIT. Simple loop. Serious rewards.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="px-8" size="lg" onClick={() => navigate("/stake")}>
              Start Staking
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button variant="outline" size="lg" className="px-8" onClick={() => navigate("/how-it-works")}>
              How it works
            </Button>
          </div>
        </div>
      </section>

      {/* Ecosystem Loop */}
      <section className="py-16 px-6 bg-card/30">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
          <Card className="relative overflow-hidden border-primary/30 bg-gradient-to-br from-primary/10 to-transparent hover-scale">
            <div className="absolute top-4 right-4 text-4xl opacity-20">🐰</div>
            <CardHeader>
              <CardTitle className="font-orbitron text-2xl">Stake $RABBIT → Earn $BUNNY</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Lock $RABBIT and farm $BUNNY with competitive APR.</p>
              <div className="flex gap-3">
                <Button size="sm" onClick={() => navigate("/stake")}>Stake $RABBIT</Button>
                <Button size="sm" variant="outline" onClick={() => navigate("/how-it-works")}>Learn more</Button>
              </div>
            </CardContent>
          </Card>
          <Card className="relative overflow-hidden border-accent/30 bg-gradient-to-br from-accent/10 to-transparent hover-scale">
            <div className="absolute top-4 right-4 text-4xl opacity-20">🐇</div>
            <CardHeader>
              <CardTitle className="font-orbitron text-2xl">Stake $BUNNY → Earn $RABBIT</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Stake $BUNNY and grow it back into $RABBIT for the loop.</p>
              <div className="flex gap-3">
                <Button size="sm" onClick={() => navigate("/stake")}>Stake $BUNNY</Button>
                <Button size="sm" variant="outline" onClick={() => navigate("/how-it-works")}>Learn more</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Highlights Strip */}
      <section className="w-full border-y border-border/50 py-5 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl mb-1">🥕</div>
              <div className="font-mono text-xl font-bold text-foreground">$425K</div>
              <div className="text-xs text-muted-foreground">Rewards Distributed</div>
            </div>
            <div>
              <div className="text-2xl mb-1">🐰</div>
              <div className="font-mono text-xl font-bold text-foreground">2.5M</div>
              <div className="text-xs text-muted-foreground">$RABBIT Staked</div>
            </div>
            <div>
              <div className="text-2xl mb-1">🐇</div>
              <div className="font-mono text-xl font-bold text-foreground">1.8M</div>
              <div className="text-xs text-muted-foreground">$BUNNY Staked</div>
            </div>
            <div>
              <div className="text-2xl mb-1">🎯</div>
              <div className="font-mono text-xl font-bold text-foreground">45.2%</div>
              <div className="text-xs text-muted-foreground">Peak APR</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-primary/5 to-accent/5 border-y border-border/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-orbitron font-bold text-4xl mb-6">Join the Rabbit × Bunny Loop</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            A playful ecosystem with professional-grade returns. Stake today and let the loop work for you.
          </p>
          <Button 
            size="lg" 
            className="px-8 py-4 text-lg font-semibold"
            onClick={() => navigate("/stake")}
          >
            Stake Now
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
