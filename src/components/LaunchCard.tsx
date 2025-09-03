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
    <div className="bg-gradient-to-br from-card to-card/50 border border-border/30 rounded-xl p-6 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 cursor-pointer group">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary/60 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
            {token.symbol.slice(0, 2)}
          </div>
          <div>
            <h3 className="font-bold text-xl text-foreground group-hover:text-primary transition-colors">{token.name}</h3>
            <p className="font-mono text-muted-foreground uppercase tracking-wider">{token.symbol}</p>
          </div>
        </div>
        
        {/* Compact Top Right Info */}
        <div className="text-right space-y-2">
          <div className="flex items-center gap-2 justify-end text-muted-foreground">
            <Users2 className="w-4 h-4" />
            <span className="font-mono text-sm font-medium">{formatNumber(token.stakers)}</span>
          </div>
          <p className="font-mono text-xs text-muted-foreground">MC: ${formatNumber(token.marketCap)}</p>
        </div>
      </div>

      {/* Main Metrics */}
      <div className="space-y-4 mb-6">
        <div className="relative overflow-hidden bg-gradient-to-r from-primary/20 to-primary/5 rounded-lg p-4 border-l-4 border-primary">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono text-sm text-primary/80 mb-1">TOTAL LOCKED</p>
              <p className="font-mono text-2xl font-bold text-primary">${formatNumber(token.totalTVL)}</p>
            </div>
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
              <Coins className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden bg-gradient-to-r from-accent/20 to-accent/5 rounded-lg p-4 border-l-4 border-accent">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono text-sm text-accent/80 mb-1">ANNUAL RETURN</p>
              <p className="font-mono text-2xl font-bold text-accent">{token.apr}%</p>
            </div>
            <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-accent" />
            </div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <Button 
        variant="default" 
        size="lg" 
        className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-semibold rounded-lg h-12 group-hover:shadow-lg transition-all duration-300"
        onClick={handleEnterPool}
      >
        <span>Stake Now</span>
        <Coins className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
      </Button>
    </div>
  );
};

export default LaunchCard;