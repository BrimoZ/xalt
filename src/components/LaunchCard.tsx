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
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary/20 rounded-sm flex items-center justify-center text-primary font-bold text-lg">
            {token.symbol.slice(0, 2)}
          </div>
          <div>
            <h3 className="font-orbitron font-bold text-foreground">{token.name}</h3>
            <p className="font-mono text-sm text-muted-foreground">${token.symbol}</p>
          </div>
        </div>
        <Badge variant={token.trend === 'up' ? 'default' : 'destructive'} className="font-mono">
          {token.trend === 'up' ? (
            <TrendingUp className="w-3 h-3 mr-1" />
          ) : (
            <TrendingDown className="w-3 h-3 mr-1" />
          )}
          {token.trendValue}%
        </Badge>
      </div>


      {/* Stats */}
      <div className="mb-6">
        {/* Primary Metrics Row */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-4">
            <div className="absolute top-2 right-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            </div>
            <p className="font-mono text-xs text-primary/80 uppercase mb-2">Total TVL</p>
            <p className="font-mono text-2xl font-bold text-primary">${formatNumber(token.totalTVL)}</p>
          </div>
          
          <div className="relative overflow-hidden bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 rounded-lg p-4">
            <div className="absolute top-2 right-2">
              <TrendingUp className="w-4 h-4 text-accent" />
            </div>
            <p className="font-mono text-xs text-accent/80 uppercase mb-2">APR</p>
            <p className="font-mono text-2xl font-bold text-accent">{token.apr}%</p>
          </div>
        </div>

        {/* Secondary Metrics Row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-background/50 border border-border/50 rounded-lg p-4">
            <p className="font-mono text-xs text-muted-foreground uppercase mb-2">Market Cap</p>
            <p className="font-mono text-lg font-bold text-foreground">${formatNumber(token.marketCap)}</p>
          </div>
          
          <div className="bg-background/50 border border-border/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="font-mono text-xs text-muted-foreground uppercase">Stakers</p>
              <Users2 className="w-3 h-3 text-muted-foreground" />
            </div>
            <p className="font-mono text-lg font-bold text-foreground">{formatNumber(token.stakers)}</p>
          </div>
        </div>
      </div>

      {/* Time */}
      <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
        <Clock className="w-3 h-3" />
        <span className="font-mono">{getTimeAgo(token.launchedAt)}</span>
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