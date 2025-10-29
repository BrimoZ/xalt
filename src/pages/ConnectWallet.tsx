import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Wallet } from "lucide-react";

const ConnectWallet = () => {
  const { user, profile, loading, connectWallet, signOut, isWalletConnected } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect authenticated users to home if they're already connected
  useEffect(() => {
    if (!loading && user && isWalletConnected) {
      navigate('/');
    }
  }, [user, isWalletConnected, loading, navigate]);

  const handleConnectWallet = async () => {
    try {
      toast({
        title: "Connecting Wallet...",
        description: "Please approve the connection in Phantom",
      });
      await connectWallet();
      toast({
        title: "Wallet Connected! 🎉",
        description: "Your Phantom wallet has been successfully connected.",
      });
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast({
        title: "Connection Failed",
        description: error instanceof Error && error.message.includes('not installed') 
          ? "Please install Phantom wallet first" 
          : "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDisconnect = async () => {
    try {
      await signOut();
      toast({
        title: "Disconnected",
        description: "Successfully disconnected from Phantom wallet.",
      });
    } catch (error) {
      console.error('Error disconnecting:', error);
      toast({
        title: "Error",
        description: "Failed to disconnect. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-6">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-[#AB9FF2] to-[#9945FF] rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Wallet className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {isWalletConnected ? 'Wallet Connected' : 'Connect Your Wallet'}
            </h1>
            <p className="text-muted-foreground">
              {isWalletConnected 
                ? 'Your Phantom wallet is successfully connected'
                : 'Link your Phantom wallet to access the platform and manage your funds'
              }
            </p>
          </div>

          {/* Connected State */}
          {isWalletConnected && profile ? (
            <Card className="bg-card border-border overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#AB9FF2] to-[#9945FF] rounded-full flex items-center justify-center">
                    <Wallet className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground">
                      {profile.display_name || 'Connected User'}
                    </h3>
                    <p className="text-sm text-muted-foreground font-mono truncate">
                      {profile.wallet_address}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-foreground">Wallet verified</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-foreground">Access to all features</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-foreground">Secure transactions enabled</span>
                  </div>
                </div>

                <Button 
                  onClick={handleDisconnect}
                  variant="outline" 
                  className="w-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                >
                  Disconnect Wallet
                </Button>
              </CardContent>
            </Card>
          ) : (
            /* Not Connected State */
            <Card className="bg-card border-border overflow-hidden">
              <CardContent className="p-0">
                {/* Benefits Section */}
                <div className="p-6 space-y-4">
                  <h3 className="font-semibold text-foreground mb-4">Why connect your wallet?</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm text-foreground">Launch fund pools</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm text-foreground">Donate to campaigns</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm text-foreground">Stake $FUND tokens</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm text-foreground">Track your contributions</span>
                    </div>
                  </div>
                </div>

                {/* Connect Button */}
                <div className="border-t border-border p-6">
                  <Button 
                    onClick={handleConnectWallet}
                    className="w-full bg-gradient-to-r from-[#AB9FF2] to-[#9945FF] hover:from-[#9C8FE3] hover:to-[#8A3FF0] text-white border-0 h-12 text-base font-medium"
                  >
                    <Wallet className="w-5 h-5 mr-2" />
                    Connect Phantom Wallet
                  </Button>
                  
                  <p className="text-xs text-muted-foreground text-center mt-4">
                    Secure connection. We never have access to your private keys.
                  </p>
                  
                  <div className="mt-4 text-center">
                    <a 
                      href="https://phantom.app/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline"
                    >
                      Don't have Phantom? Get it here →
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ConnectWallet;