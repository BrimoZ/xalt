import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Centered Hero Section */}
      <section className="flex items-center justify-center min-h-[80vh] px-6">
        <div className="text-center max-w-2xl">
          {/* Large Bunny Logo */}
          <div className="mb-12 animate-float">
            <div className="text-9xl select-none">
              🐰
            </div>
          </div>
          
          {/* Minimal Title */}
          <h1 className="font-mono text-2xl md:text-3xl font-bold text-foreground mb-6">
            Rabbit Ecosystem
          </h1>
          
          {/* Simple Description */}
          <p className="text-muted-foreground text-lg mb-12 max-w-md mx-auto leading-relaxed">
            Stake $RABBIT to earn $BUNNY. Stake $BUNNY to earn $RABBIT. 
            A symbiotic staking ecosystem.
          </p>
          
          {/* Clean Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="px-8 py-3 rounded-lg font-medium bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={() => navigate("/stake")}
            >
              <Zap className="w-4 h-4 mr-2" />
              Start Staking
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="px-8 py-3 rounded-lg font-medium border-border hover:bg-muted"
              onClick={() => navigate("/how-it-works")}
            >
              Learn More
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Minimal Stats Bar */}
      <section className="border-t border-border py-8">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-2xl font-mono font-bold text-primary mb-1">2.5M</div>
              <div className="text-sm text-muted-foreground">$RABBIT Staked</div>
            </div>
            <div>
              <div className="text-2xl font-mono font-bold text-primary mb-1">1.8M</div>
              <div className="text-sm text-muted-foreground">$BUNNY Staked</div>
            </div>
            <div>
              <div className="text-2xl font-mono font-bold text-primary mb-1">$425K</div>
              <div className="text-sm text-muted-foreground">Rewards Distributed</div>
            </div>
            <div>
              <div className="text-2xl font-mono font-bold text-primary mb-1">3,247</div>
              <div className="text-sm text-muted-foreground">Active Stakers</div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
