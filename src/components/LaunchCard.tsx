import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { TrendingUp, Clock, Users2, Target, Heart, ExternalLink, Globe, Wallet, Gift } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface LaunchCardProps {
  token: {
    id: string;
    name: string;
    symbol: string;
    icon: string;
    description?: string;
    dev: {
      handle: string;
      followers: number;
      verified: boolean;
      bio?: string;
      website?: string;
      twitter?: string;
      telegram?: string;
      discord?: string;
    };
    totalTVL: number;
    apr: number;
    marketCap: number;
    stakers: number;
    launchedAt: string;
    trend: 'up' | 'down';
    trendValue: number;
    category?: string;
  };
}

const LaunchCard = ({ token }: LaunchCardProps) => {
  const navigate = useNavigate();
  const { user, isWalletConnected } = useAuth();
  const { toast } = useToast();
  const [showDetails, setShowDetails] = useState(false);
  const [showDonateDialog, setShowDonateDialog] = useState(false);
  const [donateAmount, setDonateAmount] = useState("");
  const [hearts, setHearts] = useState(token.stakers); // Use stakers count as hearts
  const [hasGivenHeart, setHasGivenHeart] = useState(false);
  
  // Mock data - replace with real data from backend
  const [walletBalance] = useState(5000); // User's main wallet balance
  const [donationBalance] = useState(42.5); // User's donation balance from staking rewards
  const [myPoolContribution] = useState(125); // How much user has already donated to this pool

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString();
  };

  const formatFundAmount = (num: number) => {
    const formatted = formatNumber(num);
    return `${formatted} $FUND`;
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const launched = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - launched.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const handleEnterPool = () => {
    navigate(`/token/${token.id}`);
  };

  const handleGiveHeart = () => {
    if (!user || !isWalletConnected) {
      toast({
        title: "Connect your wallet",
        description: "Please connect your wallet to show support",
        variant: "destructive",
      });
      return;
    }

    if (hasGivenHeart) {
      // Remove heart
      setHearts(prev => prev - 1);
      setHasGivenHeart(false);
      toast({
        title: "Heart removed",
        description: `You've removed your support from ${token.name}`,
      });
    } else {
      // Add heart
      setHearts(prev => prev + 1);
      setHasGivenHeart(true);
      toast({
        title: "Heart given! ❤️",
        description: `You're now supporting ${token.name}`,
      });
    }
  };

  const handleDonate = () => {
    if (!user || !isWalletConnected) {
      toast({
        title: "Connect your wallet",
        description: "Please connect your wallet to donate",
        variant: "destructive",
      });
      return;
    }

    if (!donateAmount || parseFloat(donateAmount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount to donate",
        variant: "destructive",
      });
      return;
    }

    if (parseFloat(donateAmount) > donationBalance) {
      toast({
        title: "Insufficient balance",
        description: "You don't have enough in your Donation Balance. Stake tokens to earn more!",
        variant: "destructive",
      });
      return;
    }

    // TODO: Implement actual donation logic with backend
    toast({
      title: "Donation successful!",
      description: `You've donated ${donateAmount} tokens to ${token.name}`,
    });
    setDonateAmount("");
    setShowDonateDialog(false);
  };

  const fundingGoal = token.marketCap;
  const raised = token.totalTVL;
  const progressPercentage = Math.min((raised / fundingGoal) * 100, 100);

  return (
    <div 
      className="bg-card border border-border rounded-lg overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-md cursor-pointer"
    >
      {/* Image */}
      <div className="h-32 bg-gradient-to-br from-primary/20 via-accent/10 to-background relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 bg-primary/30 rounded-md flex items-center justify-center backdrop-blur-sm border border-primary/50">
            <span className="text-xl font-bold text-primary">{token.symbol.slice(0, 2)}</span>
          </div>
        </div>
        <Badge variant="outline" className="absolute top-2 right-2 text-xs h-5 bg-card/90 backdrop-blur-sm">
          {token.category || 'DeFi'}
        </Badge>
      </div>

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm text-foreground truncate">{token.name}</h3>
            <p className="text-xs text-muted-foreground truncate">{token.dev.handle}</p>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-3">
          <div className="flex items-baseline justify-between mb-1.5">
            <span className="text-lg font-bold text-primary">{formatFundAmount(raised)}</span>
            <span className="text-xs text-muted-foreground">of {formatFundAmount(fundingGoal)}</span>
          </div>
          <Progress value={progressPercentage} className="h-1.5" />
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-between text-xs mb-3">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-muted-foreground">
              <Users2 className="w-3 h-3" />
              {formatNumber(token.stakers)}
            </span>
            <span className="flex items-center gap-1 text-accent">
              <Heart className={`w-3 h-3 ${hasGivenHeart ? 'fill-accent' : ''}`} />
              {formatNumber(hearts)}
            </span>
          </div>
          <span className="flex items-center gap-1 text-muted-foreground">
            <Clock className="w-3 h-3" />
            {getTimeAgo(token.launchedAt)}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 h-8 text-xs"
            onClick={(e) => {
              e.stopPropagation();
              setShowDetails(true);
            }}
          >
            Details
          </Button>
          <Button 
            variant="cyber" 
            size="sm" 
            className="flex-1 h-8 text-xs"
            onClick={(e) => {
              e.stopPropagation();
              setShowDonateDialog(true);
            }}
          >
            Donate
          </Button>
        </div>
      </div>

      {/* Donate Dialog */}
      <Dialog open={showDonateDialog} onOpenChange={setShowDonateDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-orbitron">Donate to {token.name}</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Balances */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Wallet className="w-4 h-4 text-primary" />
                  <p className="text-xs text-muted-foreground">Wallet Balance</p>
                </div>
                <p className="text-2xl font-bold text-foreground">{walletBalance.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">$GIVE tokens</p>
              </div>
              
              <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Gift className="w-4 h-4 text-accent" />
                  <p className="text-xs text-muted-foreground">Donation Balance</p>
                </div>
                <p className="text-2xl font-bold text-accent">{donationBalance.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground mt-1">Available to donate</p>
              </div>
            </div>

            {/* Pool Funding Progress */}
            <div className="bg-card/50 border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium">Pool Funding Progress</p>
                <Badge variant="outline" className="text-xs">{progressPercentage.toFixed(1)}% funded</Badge>
              </div>
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-2xl font-bold text-primary">{formatFundAmount(raised)}</span>
                <span className="text-sm text-muted-foreground">of {formatFundAmount(fundingGoal)}</span>
              </div>
              <Progress value={progressPercentage} className="h-2.5 mb-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{formatNumber(token.stakers)} backers</span>
                <span>{formatFundAmount(fundingGoal - raised)} remaining</span>
              </div>
            </div>

            {/* My Contribution */}
            <div className="bg-muted/30 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">Your contribution to this pool</p>
                <span className="text-sm font-semibold text-accent">{myPoolContribution} tokens</span>
              </div>
            </div>

            {/* Donation Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Amount to Donate</label>
              <div className="relative">
                <Input
                  type="number"
                  placeholder="0.00"
                  value={donateAmount}
                  onChange={(e) => setDonateAmount(e.target.value)}
                  className="text-lg pr-20"
                />
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-7 text-xs"
                  onClick={() => setDonateAmount(donationBalance.toString())}
                >
                  Max
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Donations use your Donation Balance from staking rewards
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setShowDonateDialog(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="cyber" 
                className="flex-1"
                onClick={handleDonate}
                disabled={!user || !isWalletConnected}
              >
                <Gift className="w-4 h-4 mr-2" />
                Donate Now
              </Button>
            </div>

            {!user || !isWalletConnected && (
              <p className="text-xs text-center text-muted-foreground">
                Connect your wallet to start donating
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-orbitron">{token.name} Details</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Banner Image */}
            <div className="h-48 bg-gradient-to-br from-primary/20 via-accent/10 to-background rounded-lg relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-primary/30 rounded-lg flex items-center justify-center backdrop-blur-sm border-2 border-primary/50">
                  <span className="text-4xl font-bold text-primary">{token.symbol.slice(0, 2)}</span>
                </div>
              </div>
              <Badge variant="outline" className="absolute top-4 right-4 bg-card/90 backdrop-blur-sm">
                {token.category || 'DeFi'}
              </Badge>
            </div>

            {/* Funding Progress */}
            <div className="bg-card/50 border border-border rounded-lg p-6">
              <div className="flex items-baseline justify-between mb-3">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Raised</p>
                  <span className="text-3xl font-bold text-primary">{formatFundAmount(raised)}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground mb-1">Goal</p>
                  <span className="text-xl font-semibold text-foreground">{formatFundAmount(fundingGoal)}</span>
                </div>
              </div>
              <Progress value={progressPercentage} className="h-3 mb-2" />
              <p className="text-sm text-muted-foreground text-center">{progressPercentage.toFixed(1)}% funded</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-card/50 border border-border rounded-lg p-4 text-center">
                <Users2 className="w-5 h-5 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">{formatNumber(token.stakers)}</p>
                <p className="text-xs text-muted-foreground">Backers</p>
              </div>
              <div 
                className="bg-card/50 border border-border rounded-lg p-4 text-center cursor-pointer hover:border-accent/50 transition-all"
                onClick={handleGiveHeart}
              >
                <Heart 
                  className={`w-5 h-5 mx-auto mb-2 transition-all ${
                    hasGivenHeart 
                      ? 'text-accent fill-accent' 
                      : 'text-accent'
                  }`} 
                />
                <p className="text-2xl font-bold text-accent">{formatNumber(hearts)}</p>
                <p className="text-xs text-muted-foreground">
                  {hasGivenHeart ? 'You ❤️ this' : 'Give Heart'}
                </p>
              </div>
              <div className="bg-card/50 border border-border rounded-lg p-4 text-center">
                <Clock className="w-5 h-5 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm font-bold text-foreground">{getTimeAgo(token.launchedAt)}</p>
                <p className="text-xs text-muted-foreground">Launched</p>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold text-lg mb-2">About This Fund Pool</h3>
              <p className="text-muted-foreground leading-relaxed">
                {token.description || "No description provided."}
              </p>
            </div>

            {/* Creator Info */}
            <div className="border-t border-border pt-6">
              <h3 className="font-semibold text-lg mb-4">Created By</h3>
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">{token.dev.handle.slice(1, 3).toUpperCase()}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-foreground">{token.dev.handle}</p>
                    {token.dev.verified && (
                      <Badge variant="default" className="text-xs">Verified</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {token.dev.bio || `${formatNumber(token.dev.followers)} followers on X`}
                  </p>
                  
                  {/* Social Links */}
                  <div className="flex gap-2 flex-wrap">
                    {token.dev.twitter && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={token.dev.twitter} target="_blank" rel="noopener noreferrer" className="gap-1">
                          <ExternalLink className="w-3 h-3" />
                          X/Twitter
                        </a>
                      </Button>
                    )}
                    {token.dev.telegram && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={token.dev.telegram} target="_blank" rel="noopener noreferrer" className="gap-1">
                          <ExternalLink className="w-3 h-3" />
                          Telegram
                        </a>
                      </Button>
                    )}
                    {token.dev.discord && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={token.dev.discord} target="_blank" rel="noopener noreferrer" className="gap-1">
                          <ExternalLink className="w-3 h-3" />
                          Discord
                        </a>
                      </Button>
                    )}
                    {token.dev.website && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={token.dev.website} target="_blank" rel="noopener noreferrer" className="gap-1">
                          <Globe className="w-3 h-3" />
                          Website
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <Button 
              variant="cyber" 
              size="lg" 
              className="w-full"
              onClick={() => {
                setShowDetails(false);
                handleEnterPool();
              }}
            >
              Donate Now
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LaunchCard;