import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const ConnectX = () => {
  const { user, profile, loading, signInWithX, signOut, isXConnected } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect authenticated users to home if they're already connected
  useEffect(() => {
    if (!loading && user && isXConnected) {
      navigate('/');
    }
  }, [user, isXConnected, loading, navigate]);

  const handleConnectX = async () => {
    try {
      toast({
        title: "Connecting to X...",
        description: "Redirecting to X for authentication",
      });
      await signInWithX();
      toast({
        title: "Successfully Connected!",
        description: "Your X account has been linked to Xalt.",
      });
    } catch (error) {
      console.error('Error connecting X account:', error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect X account. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDisconnect = async () => {
    try {
      await signOut();
      toast({
        title: "Disconnected",
        description: "Successfully disconnected from X.",
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
            <div className="w-16 h-16 bg-black rounded-xl flex items-center justify-center mx-auto mb-4 border border-border">
              <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {isXConnected ? 'X Account Connected' : 'Connect Your X Account'}
            </h1>
            <p className="text-muted-foreground">
              {isXConnected 
                ? 'Your X account is successfully connected to Xalt'
                : 'Link your X account to access exclusive features and verify your identity'
              }
            </p>
          </div>

          {/* Connected State */}
          {isXConnected && profile ? (
            <Card className="bg-card border-border overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {profile.x_display_name || profile.display_name || 'Connected User'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      @{profile.x_username || profile.username || 'username'}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-foreground">Account verified</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-foreground">Access to exclusive features</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-foreground">Enhanced security enabled</span>
                  </div>
                </div>

                <Button 
                  onClick={handleDisconnect}
                  variant="outline" 
                  className="w-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                >
                  Disconnect X Account
                </Button>
              </CardContent>
            </Card>
          ) : (
            /* Not Connected State */
            <Card className="bg-card border-border overflow-hidden">
              <CardContent className="p-0">
                {/* Benefits Section */}
                <div className="p-6 space-y-4">
                  <h3 className="font-semibold text-foreground mb-4">Why connect your X account?</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm text-foreground">Verify token ownership</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm text-foreground">Access exclusive launches</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm text-foreground">Enhanced security features</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm text-foreground">Community engagement tools</span>
                    </div>
                  </div>
                </div>

                {/* Connect Button */}
                <div className="border-t border-border p-6">
                  <Button 
                    onClick={handleConnectX}
                    className="w-full bg-black hover:bg-black/90 text-white border-0 h-12 text-base font-medium"
                  >
                    <svg viewBox="0 0 24 24" className="w-5 h-5 mr-2 fill-white">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    Connect with X
                  </Button>
                  
                  <p className="text-xs text-muted-foreground text-center mt-4">
                    Secure OAuth 2.0 connection. We never store your password.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Demo Notice */}
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mt-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">!</span>
              </div>
              <span className="font-medium text-amber-800 dark:text-amber-200">Demo Mode</span>
            </div>
            <p className="text-xs text-amber-700 dark:text-amber-300">
              This is a mock authentication system for testing. No real X API connection is made. 
              Click "Connect with X" to simulate the OAuth flow with random demo data.
            </p>
          </div>

          {/* Footer Links */}
          <div className="text-center mt-6">
            <p className="text-xs text-muted-foreground">
              By connecting, you agree to our{" "}
              <a href="#" className="text-primary hover:underline">Privacy Policy</a>
              {" "}and{" "}
              <a href="#" className="text-primary hover:underline">Terms of Service</a>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ConnectX;