import { useState, useEffect } from "react";
import LaunchCard from "./LaunchCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTokens } from "@/contexts/TokenContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const LiveLaunchesFeed = () => {
  const { tokens, loading } = useTokens();
  const { user, isWalletConnected } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [activeTab, setActiveTab] = useState("live");
  const [totalBonded, setTotalBonded] = useState(0);
  const [totalVolume24h, setTotalVolume24h] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [creatorProfiles, setCreatorProfiles] = useState<{[key: string]: any}>({});

  const refreshLaunches = async () => {
    setIsRefreshing(true);
    await fetchStats();
    await fetchCreatorProfiles();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const fetchCreatorProfiles = async () => {
    try {
      const creatorIds = [...new Set(tokens.map(t => t.creator_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .in('id', creatorIds);
      
      const profileMap = (profiles || []).reduce((acc, profile) => {
        acc[profile.id] = profile;
        return acc;
      }, {} as {[key: string]: any});
      
      setCreatorProfiles(profileMap);
    } catch (error) {
      console.error('Error fetching creator profiles:', error);
    }
  };

  const fetchStats = async () => {
    try {
      // Fetch total bonded tokens (current_amount >= goal_amount)
      const { data: allTokens } = await supabase
        .from('tokens')
        .select('current_amount, goal_amount');
      
      const bondedCount = allTokens?.filter(t => t.current_amount >= t.goal_amount).length || 0;
      setTotalBonded(bondedCount);

      // Fetch total TVL (sum of all current_amount)
      const totalTVL = allTokens?.reduce((sum, token) => sum + Number(token.current_amount), 0) || 0;
      setTotalVolume24h(totalTVL);

      // For now, use a simple count of unique creators as active users
      const { data: uniqueCreators } = await supabase
        .from('tokens')
        .select('creator_id');

      const uniqueCount = new Set(uniqueCreators?.map(t => t.creator_id) || []).size;
      setActiveUsers(uniqueCount);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchCreatorProfiles();
  }, [tokens]);

  // Convert tokens to staking pool format - only show real user-created pools
  const launches = tokens.map(token => {
    const creatorProfile = creatorProfiles[token.creator_id];
    const displayHandle = creatorProfile?.display_name || creatorProfile?.wallet_address?.slice(0, 12) || token.creator_id.slice(0, 12);
    return {
      id: token.id,
      name: token.name,
      symbol: token.symbol,
      icon: (token.images && token.images.length > 0) ? token.images[0] : (token.image_url || ""),
      description: token.description,
      dev: {
        handle: displayHandle,
        avatar_url: token.image_url || creatorProfile?.avatar_url || null,
        wallet_address: creatorProfile?.wallet_address || token.creator_id,
        display_name: creatorProfile?.display_name || null,
        verified: false,
      },
      totalTVL: Number(token.current_amount), // Actual current amount raised
      apr: 0, // Not used anymore
      marketCap: Number(token.goal_amount), // Actual goal amount
      stakers: 0, // Will be fetched from database in LaunchCard
      launchedAt: token.created_at,
      trend: token.price_change_24h >= 0 ? 'up' : 'down' as 'up' | 'down',
      trendValue: Math.abs(token.price_change_24h),
    };
  });

  const filteredLaunches = launches.filter(launch =>
    launch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    launch.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    launch.dev.handle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter launches by status
  const liveLaunches = filteredLaunches.filter(launch => {
    const progressPercent = (launch.totalTVL / launch.marketCap) * 100;
    return progressPercent < 100;
  });

  const completedLaunches = filteredLaunches.filter(launch => {
    const progressPercent = (launch.totalTVL / launch.marketCap) * 100;
    return progressPercent >= 100;
  });

  const failedLaunches = filteredLaunches.filter(launch => {
    // For now, we don't have a "failed" status, so this is empty
    // You could add logic here based on your business rules
    return false;
  });

  const getDisplayedLaunches = () => {
    switch (activeTab) {
      case "live":
        return liveLaunches;
      case "completed":
        return completedLaunches;
      case "failed":
        return failedLaunches;
      default:
        return liveLaunches;
    }
  };

  const displayedLaunches = getDisplayedLaunches();

  return (
    <section className="py-8 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="font-mono text-primary text-lg">&gt;</span>
            <Badge variant="default" className="font-mono">
              LIVE FUNDING
            </Badge>
            <span className="w-3 h-3 bg-primary rounded-full animate-pulse"></span>
          </div>
          <h2 className="text-3xl md:text-4xl font-orbitron font-bold mb-4">
            Live Funding Pools
          </h2>
          <p className="font-mono text-muted-foreground max-w-2xl mx-auto mb-6">
            Support funding pools you believe in using your Donation Balance. Every contribution is transparent, on-chain, and trackable.
          </p>
          <Button variant="outline" size="lg" className="font-mono" asChild>
            <a href="https://pump.fun/coin/EtEFsNoUmUaGGe8Bpi3GnUguJCndaW57G5X4BkvLpump" target="_blank" rel="noopener noreferrer">
              $FUND Token
            </a>
          </Button>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search pools or creators..."
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
                💖 Most Loved
              </Button>
              <Button variant="outline" size="sm" className="justify-start">
                🚀 Nearly There
              </Button>
              <Button variant="outline" size="sm" className="justify-start">
                🆕 Fresh Dreams
              </Button>
              <Button variant="outline" size="sm" className="justify-start">
                🌱 Early Stage
              </Button>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card border border-border p-4 rounded-sm">
            <p className="font-mono text-sm text-muted-foreground">ACTIVE_POOLS</p>
            <p className="font-mono text-2xl font-bold text-primary">{liveLaunches.length}</p>
          </div>
          <div className="bg-card border border-border p-4 rounded-sm">
            <p className="font-mono text-sm text-muted-foreground">COMPLETED</p>
            <p className="font-mono text-2xl font-bold text-primary">{completedLaunches.length}</p>
          </div>
          <div className="bg-card border border-border p-4 rounded-sm">
            <p className="font-mono text-sm text-muted-foreground">TOTAL_FUNDING</p>
            <p className="font-mono text-2xl font-bold text-primary">
              {totalVolume24h >= 1000000 
                ? `${(totalVolume24h / 1000000).toFixed(1)}M` 
                : totalVolume24h >= 1000 
                ? `${(totalVolume24h / 1000).toFixed(1)}K` 
                : totalVolume24h.toFixed(0)} $FUND
            </p>
          </div>
          <div className="bg-card border border-border p-4 rounded-sm">
            <p className="font-mono text-sm text-muted-foreground">DONORS</p>
            <p className="font-mono text-2xl font-bold text-primary">{activeUsers.toLocaleString()}</p>
          </div>
        </div>

        {/* Tabs and Launches Grid */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="live" className="font-mono">
              Live ({liveLaunches.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="font-mono">
              Completed ({completedLaunches.length})
            </TabsTrigger>
            <TabsTrigger value="failed" className="font-mono">
              Failed ({failedLaunches.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="live">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground font-mono">Loading pools...</p>
              </div>
            ) : displayedLaunches.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground font-mono">No live funding pools found</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {tokens.length > 0 ? `Found ${tokens.length} total pools but none match current filters` : 'Be the first to create a funding pool!'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {displayedLaunches.map((launch) => (
                  <LaunchCard key={launch.id} token={launch} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed">
            {displayedLaunches.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground font-mono">No completed funding pools found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {displayedLaunches.map((launch) => (
                  <LaunchCard key={launch.id} token={launch} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="failed">
            {displayedLaunches.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground font-mono">No failed funding pools found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {displayedLaunches.map((launch) => (
                  <LaunchCard key={launch.id} token={launch} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default LiveLaunchesFeed;