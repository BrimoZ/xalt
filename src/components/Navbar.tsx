import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { Zap, Home, Plus, User, HelpCircle, LogOut, Wallet, Coins, Globe } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, isWalletConnected, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Social Links */}
          <div className="flex items-center gap-6">
            <div 
              className="flex items-center gap-2 cursor-pointer hover-glitch" 
              onClick={() => navigate("/")}
            >
              <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg hover:bg-yellow-300 transition-colors">
                <img 
                  src="/lovable-uploads/998b4520-3cd3-4308-930f-35d870244c7d.png" 
                  alt="FundMe Logo" 
                  className="w-6 h-6 object-contain"
                />
              </div>
              <span className="font-orbitron font-bold text-xl text-foreground">
                FundMe
              </span>
            </div>
            
            {/* Social Media Links */}
            <div className="hidden md:flex items-center gap-3">
              <a 
                href="https://x.com/FundMeFi" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a 
                href="https://t.me/fundmeportal" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            <Button
              variant={location.pathname === "/" ? "cyber" : "ghost"}
              size="sm"
              onClick={() => navigate("/")}
              className="gap-2"
            >
              <Home className="w-4 h-4" />
              Live Funding
            </Button>
            
            <Button
              variant={location.pathname === "/impact-pools" ? "cyber" : "ghost"}
              size="sm"
              onClick={() => navigate("/impact-pools")}
              className="gap-2"
            >
              <Globe className="w-4 h-4" />
              Impact Pools
            </Button>
            
            <Button
              variant={location.pathname === "/staking" ? "cyber" : "ghost"}
              size="sm"
              onClick={() => navigate("/staking")}
              className="gap-2"
            >
              <Coins className="w-4 h-4" />
              Staking
            </Button>
            
            <Button
              variant={location.pathname === "/how-it-works" ? "cyber" : "ghost"}
              size="sm"
              onClick={() => navigate("/how-it-works")}
              className="gap-2"
            >
              <HelpCircle className="w-4 h-4" />
              How it works
            </Button>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/launch")}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Launch Fund Pool
            </Button>
            
            {user && isWalletConnected ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        {profile?.display_name?.[0]?.toUpperCase() || profile?.wallet_address?.[0] || 'W'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline font-mono">
                      {profile?.wallet_address?.slice(0, 4)}...{profile?.wallet_address?.slice(-4)}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <User className="w-4 h-4 mr-2" />
                    My Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                    <LogOut className="w-4 h-4 mr-2" />
                    Disconnect
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="default"
                size="sm"
                onClick={() => navigate("/connect-wallet")}
                className="gap-2 bg-gradient-to-r from-[#AB9FF2] to-[#9945FF] hover:from-[#9C8FE3] hover:to-[#8A3FF0] text-white border-2 border-[#AB9FF2] hover:border-[#9C8FE3] shadow-lg hover:shadow-[#9945FF]/20 transition-all duration-200"
              >
                <Wallet className="w-4 h-4" />
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;