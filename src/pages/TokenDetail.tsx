import Navbar from "@/components/Navbar";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, TrendingUp, TrendingDown, ExternalLink, Globe, Send } from "lucide-react";
import { useState, useEffect } from "react";
import { useTokens } from "@/contexts/TokenContext";
import { TokenChart } from "@/components/TokenChart";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const TokenDetail = () => {
  const { tokenId } = useParams();
  const navigate = useNavigate();
  const { tokens } = useTokens();
  const { toast } = useToast();
  const { isWalletConnected } = useAuth();
  const [currentToken, setCurrentToken] = useState<any>(tokens.find(t => t.id === tokenId));
  const [creatorProfile, setCreatorProfile] = useState<any>(null);

  // Load token and creator data
  useEffect(() => {
    if (tokenId) {
      loadTokenData();
    }
  }, [tokenId]);

  const loadTokenData = async () => {
    const { data: tokenData } = await supabase
      .from('tokens')
      .select('*')
      .eq('id', tokenId)
      .single();
    
    if (tokenData) {
      setCurrentToken(tokenData);
      
      // Load creator profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', tokenData.creator_id)
        .single();
      
      if (profileData) {
        setCreatorProfile(profileData);
      }
    }
  };

  const formatNumber = (num: number | undefined) => {
    if (num === undefined || num === null) return '0';
    if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(2)}K`;
    return num.toFixed(2);
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
  };

  if (!currentToken) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-12 h-12 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading fund pool...</p>
          </div>
        </div>
      </div>
    );
  }

  const progressPercent = currentToken.goal_amount > 0 
    ? Math.min((currentToken.current_amount / currentToken.goal_amount) * 100, 100)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {/* Token Header */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Token Info Card */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-start gap-6">
                {currentToken.image_url && (
                  <img
                    src={currentToken.image_url}
                    alt={currentToken.name}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <CardTitle className="text-3xl">{currentToken.name}</CardTitle>
                    <Badge>{currentToken.symbol}</Badge>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    {currentToken.description || 'No description available'}
                  </p>
                  
                  {/* Social Links */}
                  <div className="flex gap-3">
                    {currentToken.website_url && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={currentToken.website_url} target="_blank" rel="noopener noreferrer">
                          <Globe className="w-4 h-4 mr-2" />
                          Website
                        </a>
                      </Button>
                    )}
                    {currentToken.x_url && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={currentToken.x_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          X
                        </a>
                      </Button>
                    )}
                    {currentToken.telegram_url && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={currentToken.telegram_url} target="_blank" rel="noopener noreferrer">
                          <Send className="w-4 h-4 mr-2" />
                          Telegram
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Stats Card */}
          <Card>
            <CardHeader>
              <CardTitle>Fund Pool Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Current Amount</p>
                <p className="text-2xl font-bold">${formatNumber(currentToken.current_amount)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Goal</p>
                <p className="text-xl font-bold">${formatNumber(currentToken.goal_amount)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Progress</p>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-1">{progressPercent.toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Price Change 24h</p>
                <div className={`flex items-center gap-1 ${currentToken.price_change_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {currentToken.price_change_24h >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  <span className="font-bold">{currentToken.price_change_24h >= 0 ? '+' : ''}{currentToken.price_change_24h.toFixed(2)}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Creator Info */}
        {creatorProfile && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Created By</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                {creatorProfile.avatar_url && (
                  <img
                    src={creatorProfile.avatar_url}
                    alt={creatorProfile.display_name || 'Creator'}
                    className="w-12 h-12 rounded-full"
                  />
                )}
                <div>
                  <p className="font-medium">{creatorProfile.display_name || 'Anonymous'}</p>
                  <p className="text-sm text-muted-foreground">@{creatorProfile.username}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Price Chart */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Price Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <TokenChart
              currentPrice={currentToken.current_price}
              tokenSymbol={currentToken.symbol}
              tokenId={currentToken.id}
              totalSupply={currentToken.goal_amount}
            />
          </CardContent>
        </Card>

        {/* Donation Notice */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-lg mb-4">
                {isWalletConnected 
                  ? 'Donation functionality coming soon!'
                  : 'Connect your wallet to donate to this fund pool'
                }
              </p>
              {!isWalletConnected && (
                <Button onClick={() => navigate('/connect-wallet')}>
                  Connect Wallet
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TokenDetail;