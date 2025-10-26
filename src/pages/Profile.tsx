import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useUserData } from "@/contexts/UserDataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Twitter, 
  Calendar, 
  TrendingUp, 
  Coins, 
  History, 
  Settings,
  Eye,
  ExternalLink,
  Copy,
  Gift,
  Bell,
  Shield,
  Wallet,
  CreditCard,
  Download,
  Upload,
  Link as LinkIcon
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

const Profile = () => {
  const { user, profile, loading, signOut, isWalletConnected } = useAuth();
  const { holdings, claims, trades, loading: userDataLoading, totalPortfolioValue, claimToken } = useUserData();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/connect-wallet');
    }
  }, [user, loading, navigate]);

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    toast({
      title: "Copied!",
      description: "Address copied to clipboard",
    });
  };

  const handleClaimToken = async (claimId: string, tokenName: string) => {
    try {
      await claimToken(claimId);
      toast({
        title: "Token Claimed!",
        description: `Successfully claimed ${tokenName} tokens`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to claim token. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading || userDataLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user || !isWalletConnected) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-6">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6 text-center">
              <User className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-bold mb-2">Wallet Required</h2>
              <p className="text-muted-foreground mb-6">
                Please connect your wallet to access your profile
              </p>
              <Button onClick={() => navigate('/connect-wallet')} className="w-full">
                Connect Wallet
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Profile Header */}
        <div className="mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={profile?.avatar_url} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                    {profile?.username?.[0]?.toUpperCase() || profile?.wallet_address?.[0] || 'W'}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl font-bold">
                      {profile?.display_name || 'User'}
                    </h1>
                    <Badge variant="secondary" className="gap-1">
                      <Twitter className="w-3 h-3" />
                      Connected
                    </Badge>
                  </div>
                  
                  <p className="text-muted-foreground mb-3 font-mono">
                    {profile?.wallet_address?.slice(0, 8)}...{profile?.wallet_address?.slice(-8)}
                  </p>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Joined {new Date(profile?.created_at || '').toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      ID: {user.id.slice(0, 8)}...
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-4 p-0 ml-1"
                        onClick={() => handleCopyAddress(user.id)}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm text-muted-foreground mb-1">Total Portfolio</div>
                  <div className="text-2xl font-bold text-green-600">
                    ${totalPortfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="holdings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-fit">
            <TabsTrigger value="holdings" className="gap-2">
              <Coins className="w-4 h-4" />
              Holdings
            </TabsTrigger>
            <TabsTrigger value="claims" className="gap-2">
              <Gift className="w-4 h-4" />
              Claims
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <History className="w-4 h-4" />
              History
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Holdings Tab */}
          <TabsContent value="holdings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Token Holdings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {holdings.length > 0 ? holdings.map((holding) => (
                    <div key={holding.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="font-bold text-primary">{holding.token?.symbol?.slice(0, 2) || 'T'}</span>
                        </div>
                        <div>
                          <div className="font-semibold">{holding.token?.name || 'Unknown Token'}</div>
                          <div className="text-sm text-muted-foreground">
                            {holding.balance.toLocaleString()} {holding.token?.symbol || ''}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">
                          ${(holding.balance * (holding.token?.current_price || 0)).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </div>
                        <div className={`text-sm ${(holding.token?.price_change_24h || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {(holding.token?.price_change_24h || 0) >= 0 ? '+' : ''}{holding.token?.price_change_24h?.toFixed(2) || '0.00'}%
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Coins className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No token holdings found</p>
                      <p className="text-sm">Start trading to see your holdings here</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Claims Tab */}
          <TabsContent value="claims" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="w-5 h-5" />
                  Token Claims
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {claims.length > 0 ? claims.map((claim) => (
                    <div key={claim.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center">
                          <Gift className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                          <div className="font-semibold">{claim.token_name}</div>
                          <div className="text-sm text-muted-foreground">
                            {claim.token_amount.toLocaleString()} tokens • ${claim.token_value.toFixed(2)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Expires: {new Date(claim.expires_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div>
                        {claim.claimed ? (
                          <Badge variant="secondary">Claimed</Badge>
                        ) : (
                          <Button 
                            size="sm"
                            onClick={() => handleClaimToken(claim.id, claim.token_name)}
                          >
                            Claim
                          </Button>
                        )}
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Gift className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No token claims available</p>
                      <p className="text-sm">Check back later for new claims</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5" />
                  Transaction History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trades.length > 0 ? trades.map((trade) => (
                    <div key={trade.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          trade.trade_type === 'buy' ? 'bg-green-100 dark:bg-green-900/20' :
                          'bg-red-100 dark:bg-red-900/20'
                        }`}>
                          <span className={`text-sm font-bold ${
                            trade.trade_type === 'buy' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {trade.trade_type === 'buy' ? 'B' : 'S'}
                          </span>
                        </div>
                        <div>
                          <div className="font-semibold capitalize">
                            {trade.trade_type} {trade.token?.name || 'Unknown'}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {trade.token_amount.toLocaleString()} at ${trade.price_per_token.toFixed(6)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(trade.created_at).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">${trade.sol_amount.toFixed(2)}</div>
                        {trade.transaction_hash && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-xs h-6 p-1"
                            onClick={() => handleCopyAddress(trade.transaction_hash!)}
                          >
                            <ExternalLink className="w-3 h-3 mr-1" />
                            {trade.transaction_hash.slice(0, 8)}...
                          </Button>
                        )}
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No transaction history found</p>
                      <p className="text-sm">Your trading activity will appear here</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            {/* Account Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Account Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3">Profile Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Display Name</div>
                        <div className="text-sm text-muted-foreground">
                          {profile?.display_name || 'Not set'}
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Wallet Address</div>
                        <div className="text-sm text-muted-foreground font-mono">
                          {profile?.wallet_address?.slice(0, 8)}...{profile?.wallet_address?.slice(-8) || 'Not set'}
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Copy Address
                      </Button>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-3">Connected Accounts</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Twitter className="w-5 h-5 text-blue-500" />
                        <div>
                          <div className="font-medium">Phantom Wallet</div>
                          <div className="text-sm text-muted-foreground font-mono">
                            Connected: {profile?.wallet_address?.slice(0, 8)}...{profile?.wallet_address?.slice(-8)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                          Connected
                        </Badge>
                        <Button variant="outline" size="sm">
                          Manage
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg border-dashed">
                      <div className="flex items-center gap-3">
                        <Wallet className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <div className="font-medium text-muted-foreground">Wallet Connection</div>
                          <div className="text-sm text-muted-foreground">
                            Connect your crypto wallet
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <LinkIcon className="w-4 h-4 mr-2" />
                        Connect
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notifications & Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notifications & Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3">Email Notifications</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">New Token Launches</div>
                        <div className="text-sm text-muted-foreground">
                          Get notified about exciting new token launches
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Enable
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Portfolio Updates</div>
                        <div className="text-sm text-muted-foreground">
                          Daily/weekly portfolio performance summaries
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Configure
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Token Claims</div>
                        <div className="text-sm text-muted-foreground">
                          Alerts when new tokens are available to claim
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Enable
                      </Button>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-3">Trading Preferences</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Slippage Tolerance</div>
                        <div className="text-sm text-muted-foreground">
                          Default slippage for token swaps
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        2.5%
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Auto-Approve Transactions</div>
                        <div className="text-sm text-muted-foreground">
                          Skip confirmation for small transactions
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Configure
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security & Privacy */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Security & Privacy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3">Account Security</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Two-Factor Authentication</div>
                        <div className="text-sm text-muted-foreground">
                          Add an extra layer of security to your account
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Shield className="w-4 h-4 mr-2" />
                        Enable
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Login Sessions</div>
                        <div className="text-sm text-muted-foreground">
                          Manage active sessions and devices
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View All
                      </Button>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-3">Privacy Settings</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Public Profile</div>
                        <div className="text-sm text-muted-foreground">
                          Allow others to see your public activity and holdings
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        Configure
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Analytics & Tracking</div>
                        <div className="text-sm text-muted-foreground">
                          Help improve Xalt by sharing usage data
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Manage
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Data Export</div>
                        <div className="text-sm text-muted-foreground">
                          Download your account data and transaction history
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-destructive/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <Shield className="w-5 h-5" />
                  Danger Zone
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
                  <h4 className="font-semibold text-destructive mb-2">Disconnect Account</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    This will disconnect your X account and log you out. You can reconnect anytime.
                  </p>
                  <Button 
                    variant="destructive" 
                    onClick={signOut}
                    className="w-full"
                  >
                    Disconnect X Account
                  </Button>
                </div>
                
                <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
                  <h4 className="font-semibold text-destructive mb-2">Delete Account</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                  <Button 
                    variant="destructive" 
                    className="w-full"
                    onClick={() => toast({
                      title: "Feature Coming Soon",
                      description: "Account deletion will be available in a future update.",
                    })}
                  >
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;