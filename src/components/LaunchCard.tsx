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
    category?: string;
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
            <span className="text-lg font-bold text-primary">${formatNumber(raised)}</span>
            <span className="text-xs text-muted-foreground">of ${formatNumber(fundingGoal)}</span>
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
              <Heart className="w-3 h-3" />
              {token.apr}%
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
            onClick={handleEnterPool}
          >
            Details
          </Button>
          <Button 
            variant="cyber" 
            size="sm" 
            className="flex-1 h-8 text-xs"
            onClick={handleEnterPool}
          >
            Donate
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LaunchCard;