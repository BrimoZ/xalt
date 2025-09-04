import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, BarChart3, Shield, Zap, TrendingUp, Users, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <Badge variant="outline" className="mb-6 px-4 py-2">
              Next Generation DeFi Platform
            </Badge>
            <h1 className="font-orbitron font-bold text-5xl md:text-6xl lg:text-7xl mb-6 text-foreground">
              Professional
              <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Staking Solutions
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
              Institutional-grade staking infrastructure designed for maximum returns and security. 
              Build wealth through our professionally managed dual-token ecosystem.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="px-8 py-4 text-lg font-semibold"
                onClick={() => navigate("/stake")}
              >
                Start Staking Now
                <ArrowRight className="w-5 h-5 ml-2" />
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
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-card/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-orbitron font-bold text-4xl mb-4">Why Choose Our Platform</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Enterprise-level features built for serious investors
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-border/50 bg-card/50">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="font-orbitron text-xl">Maximum Security</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Multi-signature wallets, audited smart contracts, and institutional-grade security protocols protect your assets.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="font-orbitron text-xl">High Yield Returns</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Competitive APR rates with compound growth potential through our dual-token staking mechanism.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="font-orbitron text-xl">Instant Liquidity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Flexible staking terms with no lock-up periods. Withdraw your funds anytime without penalties.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-orbitron font-bold text-4xl mb-4">Platform Performance</h2>
            <p className="text-xl text-muted-foreground">
              Trusted by thousands of investors worldwide
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-primary" />
              </div>
              <div className="text-3xl font-mono font-bold text-foreground mb-2">$2.5M+</div>
              <div className="text-sm text-muted-foreground font-medium">Total Value Locked</div>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <div className="text-3xl font-mono font-bold text-foreground mb-2">3,247</div>
              <div className="text-sm text-muted-foreground font-medium">Active Investors</div>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-primary" />
              </div>
              <div className="text-3xl font-mono font-bold text-foreground mb-2">45.2%</div>
              <div className="text-sm text-muted-foreground font-medium">Average APR</div>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
              <div className="text-3xl font-mono font-bold text-foreground mb-2">$425K</div>
              <div className="text-sm text-muted-foreground font-medium">Rewards Distributed</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-primary/5 to-accent/5 border-y border-border/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-orbitron font-bold text-4xl mb-6">Ready to Start Earning?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of investors who trust our platform for their staking needs. 
            Professional-grade infrastructure with institutional returns.
          </p>
          <Button 
            size="lg" 
            className="px-8 py-4 text-lg font-semibold"
            onClick={() => navigate("/stake")}
          >
            Get Started Today
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
