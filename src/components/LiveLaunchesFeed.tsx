import { useState, useEffect } from "react";
import LaunchCard from "./LaunchCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useTokens } from "@/contexts/TokenContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const LiveLaunchesFeed = () => {
  const { tokens } = useTokens();
  const { user, isXConnected } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [totalBonded, setTotalBonded] = useState(0);
  const [totalVolume24h, setTotalVolume24h] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);

  const refreshLaunches = async () => {
    setIsRefreshing(true);
    await fetchStats();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const fetchStats = async () => {
    try {
      // Fetch total bonded tokens (progress = 100)
      const { count: bondedCount } = await supabase
        .from('tokens')
        .select('*', { count: 'exact', head: true })
        .eq('progress', 100);
      
      setTotalBonded(bondedCount || 0);

      // Fetch total 24h volume
      const { data: volumeData } = await supabase
        .from('tokens')
        .select('volume_24h');
      
      const total24hVolume = volumeData?.reduce((sum, token) => sum + Number(token.volume_24h), 0) || 0;
      setTotalVolume24h(total24hVolume);

      // Fetch active users (users who made trades or comments in last 24h)
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      
      // Get unique users from trades
      const { data: tradeUsers } = await supabase
        .from('trades')
        .select('user_id')
        .gte('created_at', twentyFourHoursAgo);

      // Get unique users from comments
      const { data: commentUsers } = await supabase
        .from('token_comments')
        .select('user_id')
        .gte('created_at', twentyFourHoursAgo);

      const allActiveUsers = new Set([
        ...(tradeUsers?.map(t => t.user_id) || []),
        ...(commentUsers?.map(c => c.user_id) || [])
      ]);

      setActiveUsers(allActiveUsers.size);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Mockup launches
  const mockupLaunches = [
    {
      id: 'mock-1',
      name: 'RabbitFi',
      symbol: 'RABBIT',
      icon: '',
      dev: {
        handle: '@cryptorabbit',
        followers: 45000,
        verified: true,
      },
      totalTVL: 2500000,
      apr: 18.5,
      marketCap: 8500000,
      stakers: 3247,
      launchedAt: new Date(Date.now() - 3600000).toISOString(),
      trend: 'up' as const,
      trendValue: 12.4,
    },
    {
      id: 'mock-2',
      name: 'BunnySwap',
      symbol: 'BUNNY',
      icon: '',
      dev: {
        handle: '@bunnydegen',
        followers: 32000,
        verified: true,
      },
      totalTVL: 1800000,
      apr: 24.2,
      marketCap: 6200000,
      stakers: 2891,
      launchedAt: new Date(Date.now() - 7200000).toISOString(),
      trend: 'up' as const,
      trendValue: 8.9,
    },
    {
      id: 'mock-3',
      name: 'CarrotDAO',
      symbol: 'CRRT',
      icon: '',
      dev: {
        handle: '@carrotking',
        followers: 28000,
        verified: true,
      },
      totalTVL: 950000,
      apr: 31.8,
      marketCap: 3400000,
      stakers: 1654,
      launchedAt: new Date(Date.now() - 10800000).toISOString(),
      trend: 'down' as const,
      trendValue: 3.2,
    },
    {
      id: 'mock-4',
      name: 'HopToken',
      symbol: 'HOP',
      icon: '',
      dev: {
        handle: '@hopmaster',
        followers: 52000,
        verified: true,
      },
      totalTVL: 3200000,
      apr: 15.7,
      marketCap: 11000000,
      stakers: 4123,
      launchedAt: new Date(Date.now() - 14400000).toISOString(),
      trend: 'up' as const,
      trendValue: 15.6,
    },
    {
      id: 'mock-5',
      name: 'FluffyFinance',
      symbol: 'FLUFF',
      icon: '',
      dev: {
        handle: '@fluffydev',
        followers: 19000,
        verified: true,
      },
      totalTVL: 680000,
      apr: 42.5,
      marketCap: 2100000,
      stakers: 987,
      launchedAt: new Date(Date.now() - 18000000).toISOString(),
      trend: 'up' as const,
      trendValue: 22.1,
    },
    {
      id: 'mock-6',
      name: 'EggDAO',
      symbol: 'EGG',
      icon: '',
      dev: {
        handle: '@eggcellent',
        followers: 38000,
        verified: true,
      },
      totalTVL: 1500000,
      apr: 19.3,
      marketCap: 5800000,
      stakers: 2345,
      launchedAt: new Date(Date.now() - 21600000).toISOString(),
      trend: 'down' as const,
      trendValue: 5.8,
    },
  ];

  // Convert tokens to staking pool format
  const launches = [
    ...mockupLaunches,
    ...tokens.map(token => ({
    id: token.id,
    name: token.name,
    symbol: token.symbol,
    icon: token.image_url || "",
    dev: {
      handle: `@${token.creator_username}`,
      followers: Math.floor(Math.random() * 50000) + 5000,
      verified: true,
    },
    totalTVL: Math.floor(token.volume_24h * 5), // Simulated TVL based on volume
    apr: Math.floor(Math.random() * 15) + 5, // Random APR between 5-20%
    marketCap: Math.floor(token.market_cap),
    stakers: Math.floor(token.holders), // Use holders as stakers
    launchedAt: token.created_at,
    trend: token.price_change_24h >= 0 ? 'up' : 'down' as 'up' | 'down',
    trendValue: Math.abs(token.price_change_24h),
  }))
  ];

  const filteredLaunches = launches.filter(launch =>
    launch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    launch.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    launch.dev.handle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="py-8 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="font-mono text-primary text-lg">&gt;</span>
            <Badge variant="default" className="font-mono">
              LIVE LAUNCHES
            </Badge>
            <span className="w-3 h-3 bg-primary rounded-full animate-pulse"></span>
          </div>
          <h2 className="text-3xl md:text-4xl font-orbitron font-bold mb-4">
            Active Token Launches
          </h2>
          <p className="font-mono text-muted-foreground max-w-2xl mx-auto">
            Real-time launches from verified X accounts. All devs are human, all launches are transparent.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search tokens or devs..."
                className="pl-10 w-64 font-mono bg-background/50 border-border"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button 
              variant="outline" 
              size="default"
              onClick={() => setShowFilter(!showFilter)}
              className={showFilter ? "bg-primary/10 border-primary/30" : ""}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
          
          <Button 
            variant="terminal" 
            size="default"
            onClick={refreshLaunches}
            disabled={isRefreshing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Filter Panel */}
        {showFilter && (
          <div className="mb-8 p-4 bg-card border border-border rounded-sm">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" size="sm" className="justify-start">
                🔥 Trending
              </Button>
              <Button variant="outline" size="sm" className="justify-start">
                📈 High Volume
              </Button>
              <Button variant="outline" size="sm" className="justify-start">
                ⚡ New Launches
              </Button>
              <Button variant="outline" size="sm" className="justify-start">
                💎 Low Market Cap
              </Button>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card border border-border p-4 rounded-sm">
            <p className="font-mono text-sm text-muted-foreground">LIVE_TOKENS</p>
            <p className="font-mono text-2xl font-bold text-primary">{filteredLaunches.length}</p>
          </div>
          <div className="bg-card border border-border p-4 rounded-sm">
            <p className="font-mono text-sm text-muted-foreground">TOTAL_BONDED</p>
            <p className="font-mono text-2xl font-bold text-primary">{totalBonded.toLocaleString()}</p>
          </div>
          <div className="bg-card border border-border p-4 rounded-sm">
            <p className="font-mono text-sm text-muted-foreground">24H_VOLUME</p>
            <p className="font-mono text-2xl font-bold text-primary">
              ${totalVolume24h >= 1000000 
                ? `${(totalVolume24h / 1000000).toFixed(1)}M` 
                : totalVolume24h >= 1000 
                ? `${(totalVolume24h / 1000).toFixed(1)}K` 
                : totalVolume24h.toFixed(0)}
            </p>
          </div>
          <div className="bg-card border border-border p-4 rounded-sm">
            <p className="font-mono text-sm text-muted-foreground">ACTIVE_USERS</p>
            <p className="font-mono text-2xl font-bold text-primary">{activeUsers.toLocaleString()}</p>
          </div>
        </div>

        {/* Launches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredLaunches.map((launch) => (
            <LaunchCard key={launch.id} token={launch} />
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="cyber" size="lg">
            Load More Launches
          </Button>
        </div>
      </div>
    </section>
  );
};

export default LiveLaunchesFeed;