import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Play, Sparkles, Globe, Lock, Zap } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen bg-background overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-primary/3 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      {/* Floating Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Sparkles className="absolute top-20 left-20 w-6 h-6 text-primary/30 animate-bounce" style={{ animationDelay: '0s' }} />
        <Globe className="absolute top-40 right-32 w-5 h-5 text-accent/40 animate-bounce" style={{ animationDelay: '1s' }} />
        <Lock className="absolute bottom-32 left-16 w-4 h-4 text-primary/30 animate-bounce" style={{ animationDelay: '2s' }} />
        <Zap className="absolute bottom-40 right-20 w-5 h-5 text-accent/40 animate-bounce" style={{ animationDelay: '0.5s' }} />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">
        {/* Status Badge */}
        <Badge variant="secondary" className="mb-8 px-4 py-2 bg-primary/10 border-primary/20">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
          Platform is Live
        </Badge>

        {/* Main Heading */}
        <div className="max-w-4xl mx-auto mb-8 space-y-4">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight">
            <span className="block text-foreground">Build.</span>
            <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Launch.
            </span>
            <span className="block text-foreground">Scale.</span>
          </h1>
        </div>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
          Xalt is the first Solana launchpad powered by real X identities.
          <br />
          <span className="text-primary font-semibold">Verified devs. Real buyers. No bots. No fake launches.</span>
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 mb-16">
          <Button size="lg" className="h-16 px-10 text-lg font-semibold group" onClick={() => window.location.href = '/launch'}>
            Launch Your Token
            <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
          </Button>
         <Button variant="outline" size="lg" className="h-16 px-10 text-lg group" onClick={() => window.open('https://github.com/BrimoZ/xalt', '_blank')}>
  <Github className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
  Github
</Button>
        </div>

        {/* Bottom Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-muted-foreground/30 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;