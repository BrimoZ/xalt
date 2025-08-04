import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Users, TrendingUp, Shield, Globe, Rocket, ArrowRight, Code, Settings, Target, Plus, Minus } from "lucide-react";
import { useState } from "react";

const HowItWorks = () => {
  const steps = [
    {
      icon: <Rocket className="w-8 h-8 text-primary" />,
      title: "Launch Your Token",
      description: "Create and deploy your token with our easy-to-use launch pad. Set your parameters and go live in minutes.",
      badge: "Step 1"
    },
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: "Build Community",
      description: "Connect with X users and followers. Engage your community through our integrated social features.",
      badge: "Step 2"
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-primary" />,
      title: "Track Performance",
      description: "Monitor your token's progress with real-time analytics, bonding curves, and holder tracking.",
      badge: "Step 3"
    },
    {
      icon: <Globe className="w-8 h-8 text-primary" />,
      title: "Scale Globally",
      description: "Reach a global audience and scale your project with our comprehensive tokenomics tools.",
      badge: "Step 4"
    }
  ];

  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const faqs = [
    {
      question: "How long does it take to launch a token?",
      answer: "With Xalt, you can launch your token in just a few minutes. Our streamlined process handles smart contract deployment, verification, and initial setup automatically."
    },
    {
      question: "Do I need technical knowledge to use Xalt?",
      answer: "No technical knowledge required! Our user-friendly interface guides you through each step. Simply connect your X account, set your token parameters, and launch."
    },
    {
      question: "What are bonding curves and how do they work?",
      answer: "Bonding curves automatically manage your token's price based on supply and demand. As more tokens are bought, the price increases gradually, ensuring fair price discovery."
    },
    {
      question: "Can I customize my token's parameters?",
      answer: "Yes! You can set your token name, symbol, total supply, hardcap, and choose between different launch modes including community access controls."
    },
    {
      question: "How does X integration work?",
      answer: "Connect your X account to leverage your existing followers and network. You can restrict token access to your followers or make it open to all X users."
    },
    {
      question: "Are the smart contracts secure?",
      answer: "All smart contracts are audited and battle-tested. We use industry-standard security practices and automated verification to ensure your token is safe."
    }
  ];

  const platformFlow = [
    {
      icon: <Settings className="w-8 h-8 text-primary" />,
      title: "Configure",
      description: "Set up your token parameters, name, symbol, and initial settings"
    },
    {
      icon: <Code className="w-8 h-8 text-primary" />,
      title: "Deploy",
      description: "Smart contract deployment to blockchain with automated verification"
    },
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: "Community",
      description: "Connect your X account and start building your community"
    },
    {
      icon: <Target className="w-8 h-8 text-primary" />,
      title: "Launch",
      description: "Go live with bonding curve mechanics and real-time trading"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-orbitron font-bold text-foreground mb-6">
            How Xalt Works
          </h1>
          <p className="text-muted-foreground text-xl max-w-3xl mx-auto">
            The easiest way to launch, manage, and scale your token project. 
            From concept to community in just a few clicks.
          </p>
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
                  {step.icon}
                </div>
                <CardTitle className="text-xl font-orbitron">{step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Platform Flow Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-orbitron font-bold text-foreground mb-4">
              Platform Flow
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our streamlined launching process takes you from concept to live token in minutes
            </p>
          </div>
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {platformFlow.map((flow, index) => (
                <div key={index} className="relative">
                  <Card className="bg-card/50 border-border backdrop-blur-sm hover:bg-card/80 transition-all duration-300 h-full">
                    <CardContent className="p-6 text-center">
                      <div className="flex justify-center mb-4">
                        {flow.icon}
                      </div>
                      <h3 className="font-orbitron font-semibold mb-3 text-lg">{flow.title}</h3>
                      <p className="text-muted-foreground text-sm">{flow.description}</p>
                    </CardContent>
                  </Card>
                  {index < platformFlow.length - 1 && (
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
              Everything you need to know about launching tokens on Xalt
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
      </div>

      <Footer />
    </div>
  );
};

export default HowItWorks;