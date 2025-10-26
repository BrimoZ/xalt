import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Users, TrendingUp, Shield, Globe, Target, ArrowRight, HandHeart, DollarSign, Plus, Minus } from "lucide-react";
import { useState } from "react";

const HowItWorks = () => {
  const steps = [
    {
      icon: <Target className="w-8 h-8 text-primary" />,
      title: "Create Your Fund Pool",
      description: "Set up your funding goal, describe your project, and launch your pool in minutes with transparent on-chain tracking.",
      badge: "Step 1"
    },
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: "Share with Backers",
      description: "Connect with supporters through X, Telegram, and Discord. Build your community and share your vision.",
      badge: "Step 2"
    },
    {
      icon: <Heart className="w-8 h-8 text-primary" />,
      title: "Receive Donations",
      description: "Backers support your pool using their Donation Balance. Every contribution is tracked on-chain for full transparency.",
      badge: "Step 3"
    },
    {
      icon: <Globe className="w-8 h-8 text-primary" />,
      title: "Reach Your Goal",
      description: "Track progress in real-time as your funding pool grows. Engage with backers and build lasting relationships.",
      badge: "Step 4"
    }
  ];

  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const faqs = [
    {
      question: "How do I create a funding pool?",
      answer: "Creating a fund pool on FundMe takes just minutes. Connect your wallet, set your funding goal and details, add social links, and launch. Our platform handles all the on-chain tracking automatically."
    },
    {
      question: "What is Donation Balance?",
      answer: "Donation Balance is the currency backers use to support funding pools on FundMe. It ensures fair and transparent contributions, with all transactions recorded on-chain."
    },
    {
      question: "How does the funding process work?",
      answer: "Backers discover your pool, review your details, and contribute using their Donation Balance. You can track all contributions in real-time, engage with backers through hearts and questions."
    },
    {
      question: "Can I customize my funding pool?",
      answer: "Yes! You can set your funding goal, add detailed descriptions, upload images, and link your social media accounts (X, Telegram, Discord) to build community engagement."
    },
    {
      question: "How do backers interact with pools?",
      answer: "Backers can give hearts to show support, donate from their balance, ask questions, and track the funding progress. All interactions are transparent and on-chain."
    },
    {
      question: "Is FundMe secure?",
      answer: "Absolutely. All transactions are on-chain using Solana blockchain, ensuring complete transparency and security. Wallet authentication through Phantom provides additional protection."
    }
  ];

  const platformFlow = [
    {
      icon: <Target className="w-8 h-8 text-primary" />,
      title: "Set Goal",
      description: "Define your funding target and project details"
    },
    {
      icon: <HandHeart className="w-8 h-8 text-primary" />,
      title: "Share",
      description: "Promote your pool across social media to attract backers"
    },
    {
      icon: <DollarSign className="w-8 h-8 text-primary" />,
      title: "Receive",
      description: "Get donations from backers using their Donation Balance"
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-primary" />,
      title: "Succeed",
      description: "Track progress and engage with your community"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-orbitron font-bold text-foreground mb-6">
            How FundMe Works
          </h1>
          <p className="text-muted-foreground text-xl max-w-3xl mx-auto">
            The easiest way to create, share, and fund your projects. 
            From concept to funding in just a few clicks.
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
              Funding Flow
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our streamlined process takes you from idea to funded project seamlessly
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
              Everything you need to know about crowdfunding on FundMe
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
