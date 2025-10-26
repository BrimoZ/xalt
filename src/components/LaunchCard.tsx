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

  return (
    <div 
      className="bg-card border border-border rounded-lg p-4 transition-all duration-300 hover:border-primary/50 hover:shadow-md cursor-pointer"
      onClick={handleEnterPool}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary/20 rounded-md flex items-center justify-center">
            <span className="text-sm font-bold text-primary">{token.symbol.slice(0, 2)}</span>
          </div>
          <div>
            <h3 className="font-semibold text-sm text-foreground">{token.name}</h3>
            <p className="text-xs text-muted-foreground">{token.dev.handle}</p>
          </div>
        </div>
        {token.trend === 'up' && (
          <Badge variant="default" className="text-xs h-5">
            <TrendingUp className="w-2.5 h-2.5 mr-0.5" />
            Hot
          </Badge>
        )}
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

      {/* Action */}
      <Button 
        variant="cyber" 
        size="sm" 
        className="w-full h-8 text-xs"
      >
        Back Project
      </Button>
    </div>
  );
};

export default LaunchCard;