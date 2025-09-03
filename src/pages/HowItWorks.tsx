import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Zap, Users, TrendingUp, Shield, Globe, Rocket, ArrowRight, Code, Settings, Target, Plus, Minus, Coins, Star, Wallet, RotateCcw } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const HowItWorks = () => {
  const navigate = useNavigate();
  
  const steps = [
    {
      icon: <Wallet className="w-8 h-8 text-primary" />,
      title: "Connect Your Wallet",
      description: "Start by connecting your wallet to access the Rabbit ecosystem and view your token balances.",
      badge: "Step 1",
      emoji: "🔗"
    },
    {
      icon: <Coins className="w-8 h-8 text-primary" />,
      title: "Stake Your Tokens",
      description: "Choose to stake $RABBIT to earn $BUNNY or stake $BUNNY to earn $RABBIT. Pick your strategy!",
      badge: "Step 2",
      emoji: "🐰"
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-accent" />,
      title: "Earn Rewards",
      description: "Watch your rewards accumulate over time with competitive APR rates on both staking pools.",
      badge: "Step 3",
      emoji: "🥕"
    },
    {
      icon: <RotateCcw className="w-8 h-8 text-primary" />,
      title: "Compound & Cycle",
      description: "Claim rewards and stake them in the opposite pool to maximize your earnings through compounding.",
      badge: "Step 4",
      emoji: "🔄"
    }
  ];

  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const faqs = [
    {
      question: "How does the dual-token staking system work?",
      answer: "Our ecosystem features two interconnected staking pools. Stake $RABBIT to earn $BUNNY rewards, or stake $BUNNY to earn $RABBIT rewards. This creates a symbiotic relationship where both tokens support each other's growth and utility."
    },
    {
      question: "What are the current APR rates for staking?",
      answer: "Current rates are approximately 45.2% APR for the $RABBIT pool and 38.7% APR for the $BUNNY pool. These rates are dynamic and adjust based on pool size and market conditions."
    },
    {
      question: "Can I unstake my tokens at any time?",
      answer: "Yes, you can unstake your tokens at any time without lock-up periods. However, we recommend holding for longer periods to maximize your reward accumulation and take advantage of compounding effects."
    },
    {
      question: "How often are rewards distributed?",
      answer: "Rewards are calculated and distributed continuously in real-time. You can claim your accumulated rewards at any time through the staking dashboard."
    },
    {
      question: "What's the best strategy for maximizing returns?",
      answer: "The optimal strategy involves cycling between pools: stake $RABBIT to earn $BUNNY, then stake those $BUNNY rewards to earn more $RABBIT. This compounding approach maximizes your overall returns over time."
    },
    {
      question: "Are there any fees for staking or claiming rewards?",
      answer: "There are minimal network transaction fees for staking, unstaking, and claiming rewards. The platform itself doesn't charge additional fees beyond standard blockchain gas costs."
    }
  ];

  const stakingFlow = [
    {
      icon: <Wallet className="w-8 h-8 text-primary" />,
      title: "Connect",
      description: "Link your wallet to access the staking dashboard and view your balances",
      emoji: "🔗"
    },
    {
      icon: <Target className="w-8 h-8 text-primary" />,
      title: "Choose Pool",
      description: "Select either $RABBIT→$BUNNY or $BUNNY→$RABBIT staking pool",
      emoji: "🎯"
    },
    {
      icon: <Coins className="w-8 h-8 text-accent" />,
      title: "Stake Tokens",
      description: "Enter the amount you want to stake and confirm the transaction",
      emoji: "🐰"
    },
    {
      icon: <Star className="w-8 h-8 text-yellow-500" />,
      title: "Earn & Claim",
      description: "Watch rewards accumulate and claim them anytime",
      emoji: "🥕"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="relative text-6xl">
              🐰
              <div className="absolute -top-2 -right-2 text-2xl animate-bounce">
                🥕
              </div>
            </div>
          </div>
          <h1 className="text-5xl font-orbitron font-bold text-foreground mb-6">
            How Rabbit Staking Works
          </h1>
          <p className="text-muted-foreground text-xl max-w-3xl mx-auto mb-8">
            Discover the power of our dual-token ecosystem where $RABBIT and $BUNNY create 
            sustainable rewards through innovative cross-staking mechanics.
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate("/stake")}
            className="px-8 py-4 text-lg"
          >
            <Zap className="w-5 h-5 mr-2" />
            Start Staking Now
          </Button>
        </div>

        {/* Core Mechanics Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-orbitron font-bold text-foreground mb-4">
              Core Staking Mechanics
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Two interconnected pools that create a thriving ecosystem
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Rabbit Pool */}
            <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-primary/10 to-transparent">
              <div className="absolute top-4 right-4 text-4xl opacity-30">🐰</div>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                    <Coins className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-orbitron text-xl">$RABBIT Pool</div>
                    <div className="text-sm text-muted-foreground font-normal">Stake $RABBIT → Earn $BUNNY</div>
                  </div>
                  <Badge variant="default" className="ml-auto">
                    45.2% APR
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Deposit your $RABBIT tokens to earn $BUNNY rewards. The more you stake, 
                  the more $BUNNY you accumulate over time.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>High APR rewards</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-500" />
                    <span>No lock-up periods</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bunny Pool */}
            <Card className="relative overflow-hidden border-accent/20 bg-gradient-to-br from-accent/10 to-transparent">
              <div className="absolute top-4 right-4 text-4xl opacity-30">🐇</div>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <div className="font-orbitron text-xl">$BUNNY Pool</div>
                    <div className="text-sm text-muted-foreground font-normal">Stake $BUNNY → Earn $RABBIT</div>
                  </div>
                  <Badge variant="secondary" className="ml-auto">
                    38.7% APR
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Grow your $BUNNY back into $RABBIT through reverse staking. 
                  Create a sustainable cycle of continuous rewards.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <RotateCcw className="w-4 h-4 text-blue-500" />
                    <span>Compound growth potential</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-purple-500" />
                    <span>Ecosystem sustainability</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Cycle Visualization */}
          <div className="bg-card/30 rounded-xl p-8 border border-border/50">
            <div className="text-center mb-6">
              <h3 className="font-orbitron font-bold text-xl mb-2">The Rabbit Cycle</h3>
              <p className="text-muted-foreground">How the ecosystem creates sustainable rewards</p>
            </div>
            <div className="flex items-center justify-center gap-8 flex-wrap">
              <div className="text-center">
                <div className="text-4xl mb-2">🐰</div>
                <div className="font-mono font-bold text-primary">Stake $RABBIT</div>
              </div>
              <ArrowRight className="w-6 h-6 text-muted-foreground" />
              <div className="text-center">
                <div className="text-4xl mb-2">🥕</div>
                <div className="font-mono font-bold text-accent">Earn $BUNNY</div>
              </div>
              <ArrowRight className="w-6 h-6 text-muted-foreground" />
              <div className="text-center">
                <div className="text-4xl mb-2">🐇</div>
                <div className="font-mono font-bold text-accent">Stake $BUNNY</div>
              </div>
              <ArrowRight className="w-6 h-6 text-muted-foreground" />
              <div className="text-center">
                <div className="text-4xl mb-2">🔄</div>
                <div className="font-mono font-bold text-primary">Earn More $RABBIT</div>
              </div>
            </div>
          </div>
        </div>

        {/* Steps Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {steps.map((step, index) => (
            <Card key={index} className="bg-card/50 border-border backdrop-blur-sm hover:bg-card/80 transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    {step.badge}
                  </Badge>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{step.emoji}</span>
                    {step.icon}
                  </div>
                </div>
                <CardTitle className="text-xl font-orbitron">{step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Staking Flow Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-orbitron font-bold text-foreground mb-4">
              Staking Process
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Simple steps to start earning rewards in the Rabbit ecosystem
            </p>
          </div>
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {stakingFlow.map((flow, index) => (
                <div key={index} className="relative">
                  <Card className="bg-card/50 border-border backdrop-blur-sm hover:bg-card/80 transition-all duration-300 h-full">
                    <CardContent className="p-6 text-center">
                      <div className="flex justify-center mb-4 gap-2">
                        <span className="text-2xl">{flow.emoji}</span>
                        {flow.icon}
                      </div>
                      <h3 className="font-orbitron font-semibold mb-3 text-lg">{flow.title}</h3>
                      <p className="text-muted-foreground text-sm">{flow.description}</p>
                    </CardContent>
                  </Card>
                  {index < stakingFlow.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                      <ArrowRight className="w-6 h-6 text-primary" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-orbitron font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Everything you need to know about staking in the Rabbit ecosystem
            </p>
          </div>
          <div className="max-w-4xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="bg-card/50 border-border backdrop-blur-sm">
                <button
                  onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-card/80 transition-colors"
                >
                  <h3 className="font-orbitron font-semibold text-lg">{faq.question}</h3>
                  {openFAQ === index ? (
                    <Minus className="w-5 h-5 text-primary flex-shrink-0" />
                  ) : (
                    <Plus className="w-5 h-5 text-primary flex-shrink-0" />
                  )}
                </button>
                {openFAQ === index && (
                  <div className="px-6 pb-6">
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl p-8 border border-primary/20">
          <div className="text-4xl mb-4">🐰🥕🐇</div>
          <h2 className="font-orbitron font-bold text-2xl mb-4">Ready to Start Earning?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Join thousands of users already earning rewards in our innovative dual-token staking ecosystem.
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate("/stake")}
            className="px-8 py-4 text-lg"
          >
            <Wallet className="w-5 h-5 mr-2" />
            Go to Staking Dashboard
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HowItWorks;