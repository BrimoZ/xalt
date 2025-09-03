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
        {/* Horizontal Badge Layout */}
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <span className="font-mono text-xs text-primary font-medium">TVL</span>
            <span className="font-mono text-sm font-bold text-primary">${formatNumber(token.totalTVL)}</span>
          </div>
          
          <div className="flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-2">
            <TrendingUp className="w-3 h-3 text-accent" />
            <span className="font-mono text-xs text-accent font-medium">APR</span>
            <span className="font-mono text-sm font-bold text-accent">{token.apr}%</span>
          </div>
          
          <div className="flex items-center gap-2 bg-muted/10 border border-muted/20 rounded-full px-4 py-2">
            <span className="font-mono text-xs text-muted-foreground font-medium">MCap</span>
            <span className="font-mono text-sm font-bold text-foreground">${formatNumber(token.marketCap)}</span>
          </div>
          
          <div className="flex items-center gap-2 bg-muted/10 border border-muted/20 rounded-full px-4 py-2">
            <Users2 className="w-3 h-3 text-muted-foreground" />
            <span className="font-mono text-xs text-muted-foreground font-medium">Stakers</span>
            <span className="font-mono text-sm font-bold text-foreground">{formatNumber(token.stakers)}</span>
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