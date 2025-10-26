import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Calendar, 
  Settings,
  Copy,
  LogOut,
  Wallet
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

const Profile = () => {
  const { user, profile, loading, signOut, isWalletConnected } = useAuth();
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

  const handleDisconnect = async () => {
    try {
      await signOut();
      toast({
        title: "Disconnected",
        description: "Your wallet has been disconnected",
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to disconnect wallet",
        variant: "destructive",
      });
    }
  };

  if (loading) {
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
      
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src={profile?.avatar_url || ''} />
                <AvatarFallback>
                  {profile?.display_name?.charAt(0) || profile?.username?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">
                  {profile?.display_name || 'Anonymous User'}
                </h1>
                <p className="text-muted-foreground mb-2">@{profile?.username}</p>
                
                <div className="flex flex-wrap gap-4 items-center">
                  <div className="flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-mono">
                      {profile?.wallet_address?.slice(0, 6)}...{profile?.wallet_address?.slice(-4)}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopyAddress(profile?.wallet_address || '')}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    Joined {new Date(profile?.created_at || '').toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Total Raised</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">${(profile?.total_raised || 0).toFixed(2)}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Total Donated</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">${(profile?.total_donated || 0).toFixed(2)}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Net Impact</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                ${((profile?.total_raised || 0) - (profile?.total_donated || 0)).toFixed(2)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="settings" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>
          
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Profile Information</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Your profile information is automatically generated from your wallet connection.
                  </p>
                  <Separator />
                </div>
                
                <div>
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <Wallet className="w-4 h-4" />
                    Connected Wallet
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {profile?.wallet_address}
                  </p>
                  <Button
                    variant="destructive"
                    onClick={handleDisconnect}
                    className="mt-2"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Disconnect Wallet
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-8">
                  Activity tracking coming soon!
                </p>
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