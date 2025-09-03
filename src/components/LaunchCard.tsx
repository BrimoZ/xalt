import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Clock, Users2, Coins } from "lucide-react";
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

  return (
    <div className="bg-card border border-border rounded-sm p-6 hover-glitch transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20 cursor-pointer">
      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        {/* Larger Pool Image */}
        <div className="w-20 h-20 bg-primary/20 rounded-lg flex items-center justify-center text-primary font-bold text-2xl border border-primary/30 flex-shrink-0">
          {token.symbol.slice(0, 2)}
        </div>
        
        {/* Token Info and Trend */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0 pr-2">
              <h3 className="font-orbitron font-bold text-foreground text-lg truncate">{token.name}</h3>
              <p className="font-mono text-sm text-muted-foreground">${token.symbol}</p>
            </div>
            <Badge variant={token.trend === 'up' ? 'default' : 'destructive'} className="font-mono flex-shrink-0">
              {token.trend === 'up' ? (
                <TrendingUp className="w-3 h-3 mr-1" />
              ) : (
                <TrendingDown className="w-3 h-3 mr-1" />
              )}
              {token.trendValue}%
            </Badge>
          </div>
          
          {/* Time */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span className="font-mono">{getTimeAgo(token.launchedAt)}</span>
          </div>
        </div>
      </div>


      {/* Stats */}
      <div className="mb-6 space-y-2">
        {/* Featured Metric - TVL */}
        <div className="bg-gradient-to-r from-primary/20 via-primary/10 to-transparent p-4 rounded-lg border-l-4 border-primary">
          <div className="flex items-center justify-between">
            <h4 className="font-mono text-lg font-bold text-primary">${formatNumber(token.totalTVL)}</h4>
            <div className="px-2 py-1 bg-primary/20 rounded text-xs font-mono text-primary">TVL</div>
          </div>
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-accent/5 border border-accent/20 p-3 rounded text-center">
            <p className="font-mono text-xs text-accent/80 mb-1">APR</p>
            <p className="font-mono font-bold text-accent">{token.apr}%</p>
          </div>
          
          <div className="bg-muted/5 border border-muted/20 p-3 rounded text-center">
            <p className="font-mono text-xs text-muted-foreground mb-1">MCap</p>
            <p className="font-mono font-bold text-foreground text-sm">${formatNumber(token.marketCap)}</p>
          </div>
          
          <div className="bg-muted/5 border border-muted/20 p-3 rounded text-center">
            <p className="font-mono text-xs text-muted-foreground mb-1">Stakers</p>
            <p className="font-mono font-bold text-foreground text-sm">{formatNumber(token.stakers)}</p>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <Button 
        variant="cyber" 
        size="default" 
        className="w-full"
        onClick={handleEnterPool}
      >
        Enter Pool
      </Button>
    </div>
  );
};

export default LaunchCard;