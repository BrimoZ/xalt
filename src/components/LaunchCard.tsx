import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Clock, Users2, Target, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface LaunchCardProps {
  token: {
    id: string;
    name: string;
    symbol: string;
    icon: string;
    dev: {
      handle: string;
      followers: number;
      verified: boolean;
    };
    totalTVL: number;
    apr: number;
    marketCap: number;
    stakers: number;
    launchedAt: string;
    trend: 'up' | 'down';
    trendValue: number;
  };
}

const LaunchCard = ({ token }: LaunchCardProps) => {
  const navigate = useNavigate();
  const { user, isXConnected } = useAuth();
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
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

  const fundingGoal = token.marketCap;
  const raised = token.totalTVL;
  const progressPercentage = Math.min((raised / fundingGoal) * 100, 100);
  const daysLeft = Math.max(7 - Math.floor((Date.now() - new Date(token.launchedAt).getTime()) / (1000 * 60 * 60 * 24)), 0);

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20 cursor-pointer group">
      {/* Banner Image */}
      <div className="h-48 bg-gradient-to-br from-primary/20 via-accent/10 to-background relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 bg-primary/30 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-primary/50">
            <span className="text-3xl font-bold text-primary">{token.symbol.slice(0, 2)}</span>
          </div>
        </div>
        {token.trend === 'up' && (
          <Badge variant="default" className="absolute top-4 right-4 font-mono">
            <TrendingUp className="w-3 h-3 mr-1" />
            Trending
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Header */}
        <div className="mb-4">
          <h3 className="font-orbitron font-bold text-xl text-foreground mb-1">{token.name}</h3>
          <p className="text-sm text-muted-foreground">by {token.dev.handle}</p>
        </div>

        {/* Funding Stats */}
        <div className="mb-6">
          <div className="flex items-baseline justify-between mb-2">
            <div>
              <span className="text-2xl font-bold text-primary">${formatNumber(raised)}</span>
              <span className="text-sm text-muted-foreground ml-2">raised</span>
            </div>
            <div className="text-right">
              <span className="text-lg font-semibold text-foreground">{progressPercentage.toFixed(0)}%</span>
            </div>
          </div>
          
          {/* Progress Bar */}
          <Progress value={progressPercentage} className="h-2 mb-2" />
          
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Target className="w-3 h-3" />
              Goal: ${formatNumber(fundingGoal)}
            </span>
            <span className="font-mono">{progressPercentage >= 100 ? 'FUNDED' : `${daysLeft}d left`}</span>
          </div>
        </div>

        {/* Supporting Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-background/50 rounded-lg p-3 border border-border/30">
            <div className="flex items-center gap-2 mb-1">
              <Users2 className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground">Backers</span>
            </div>
            <p className="font-mono text-lg font-bold text-foreground">{formatNumber(token.stakers)}</p>
          </div>
          
          <div className="bg-background/50 rounded-lg p-3 border border-border/30">
            <div className="flex items-center gap-2 mb-1">
              <Heart className="w-4 h-4 text-accent" />
              <span className="text-xs text-muted-foreground">APR</span>
            </div>
            <p className="font-mono text-lg font-bold text-accent">{token.apr}%</p>
          </div>
        </div>

        {/* Time */}
        <div className="flex items-center gap-2 mb-4 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span className="font-mono">{getTimeAgo(token.launchedAt)}</span>
        </div>

        {/* Action Button */}
        <Button 
          variant="cyber" 
          size="lg" 
          className="w-full group-hover:scale-[1.02] transition-transform"
          onClick={handleEnterPool}
        >
          Back This Project
        </Button>
      </div>
    </div>
  );
};

export default LaunchCard;