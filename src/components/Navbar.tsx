import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, isXConnected, signOut } = useAuth();

  const handleSignOut = () => {
    signOut();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Left side - Logo */}
        <div className="flex items-center">
          <button 
            onClick={() => navigate("/")}
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <div className="text-2xl font-bold text-primary">
              #~ BUNNY
            </div>
          </button>
        </div>

        {/* Center - Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <button 
            onClick={() => navigate("/stake")}
            className={`text-sm font-medium transition-colors hover:text-primary ${
              location.pathname === "/stake" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Vault
          </button>
          <button 
            onClick={() => navigate("/profile")}
            className={`text-sm font-medium transition-colors hover:text-primary ${
              location.pathname === "/profile" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => navigate("/how-it-works")}
            className={`text-sm font-medium transition-colors hover:text-primary ${
              location.pathname === "/how-it-works" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            More
          </button>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* BSC Badge */}
          <div className="hidden sm:flex items-center px-3 py-1.5 rounded-md bg-muted/50 border border-border">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
            <span className="text-sm font-medium">BSC</span>
          </div>

          {user && profile && isXConnected ? (
            <>
              {/* Wallet Balance */}
              <div className="hidden sm:flex items-center text-sm font-mono">
                <span className="text-muted-foreground mr-2">Balance:</span>
                <span className="text-primary font-bold">$1,250.50</span>
              </div>
              
              {/* User Menu */}
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className="border-primary/20 text-primary hover:bg-primary/10"
                >
                  {profile.display_name || "User"}
                </Button>
              </div>
            </>
          ) : (
            <Button 
              onClick={() => navigate("/connect-x")}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-6"
            >
              Connect Wallet
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;