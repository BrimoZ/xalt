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
      
      {/* Status Bar */}
      <div className="border-b border-border/40 bg-background/95">
        <div className="container flex h-12 items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <div className="w-4 h-4 flex items-center justify-center">
              <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
            </div>
            <span>No Active Proposals</span>
          </div>
          
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <span className="text-muted-foreground">TVL</span>
              <span className="font-mono font-bold text-foreground">$4,198,160</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center">
                <span className="text-xs">🐰</span>
              </div>
              <div className="w-6 h-6 bg-yellow-500/20 rounded-full flex items-center justify-center">
                <span className="text-xs">⚡</span>
              </div>
              <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center">
                <span className="text-xs">🚀</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Centered Content */}
      <section className="flex items-center justify-center min-h-[calc(100vh-8rem)] px-6">
        <div className="text-center max-w-2xl">
          {/* Large Centered Bunny Logo - exactly like the reference */}
          <div className="mb-16">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-full flex items-center justify-center">
              <div className="text-4xl">🐰</div>
            </div>
          </div>
          
          {/* Optional content can go here */}
          <div className="space-y-4 opacity-0 hover:opacity-100 transition-opacity duration-300">
            <h1 className="font-mono text-lg font-medium text-muted-foreground">
              Rabbit Ecosystem
            </h1>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Stake your tokens to earn rewards
            </p>
            <div className="flex gap-3 justify-center mt-8">
              <Button 
                size="sm"
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={() => navigate("/stake")}
              >
                <Zap className="w-3 h-3 mr-2" />
                Vault
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="border-border hover:bg-muted/50"
                onClick={() => navigate("/how-it-works")}
              >
                Learn More
                <ArrowRight className="w-3 h-3 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Partner Bar - like the reference */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-border/40 bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center">
            <span className="text-primary font-bold text-sm">BUNNYSTORE</span>
            <div className="w-4 h-4 ml-2 bg-primary/20 rounded flex items-center justify-center">
              <div className="w-2 h-2 bg-primary rounded"></div>
            </div>
          </div>
          
          <div className="flex items-center space-x-6 text-xs text-muted-foreground">
            <span className="hover:text-foreground transition-colors cursor-pointer">Immunefi</span>
            <span className="hover:text-foreground transition-colors cursor-pointer">BINANCE</span>
            <span className="hover:text-foreground transition-colors cursor-pointer">PeckShield</span>
            <span className="hover:text-foreground transition-colors cursor-pointer">Theori</span>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;
