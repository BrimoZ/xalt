import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { TokenProvider } from "./contexts/TokenContext";
import { UserDataProvider } from "./contexts/UserDataContext";
import Index from "./pages/Index";
import TokenDetail from "./pages/TokenDetail";
import LaunchToken from "./pages/LaunchToken";
import ConnectWallet from "./pages/ConnectWallet";
import Profile from "./pages/Profile";
import HowItWorks from "./pages/HowItWorks";
import Staking from "./pages/Staking";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TokenProvider>
        <UserDataProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/token/:tokenId" element={<TokenDetail />} />
                <Route path="/launch" element={<LaunchToken />} />
                <Route path="/connect-wallet" element={<ConnectWallet />} />
                <Route path="/profile" element={<Profile />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/staking" element={<Staking />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </UserDataProvider>
      </TokenProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
