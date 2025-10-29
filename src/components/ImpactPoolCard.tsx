import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Users, LucideIcon, Wallet, Gift } from "lucide-react";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface ImpactPool {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  totalDonations: number;
  backers: number;
  imageUrl: string;
  foundations?: Array<{
    name: string;
    acceptsCrypto: boolean;
  }>;
}

interface ImpactPoolCardProps {
  pool: ImpactPool;
}

const ImpactPoolCard = ({ pool }: ImpactPoolCardProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showDonate, setShowDonate] = useState(false);
  const [donateAmount, setDonateAmount] = useState("");
  const [walletBalance, setWalletBalance] = useState(0);
  const [donationBalance, setDonationBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const Icon = pool.icon;

  useEffect(() => {
    if (showDonate && user) {
      console.log('Dialog opened, fetching balances for user:', user.id);
      fetchBalances();
    }
  }, [showDonate, user]);

  const fetchBalances = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Fetch donation balance from staking
      const { data: stakingData, error: stakingError } = await supabase
        .from('staking')
        .select('donation_balance')
        .eq('user_id', user.id)
        .maybeSingle();

      if (stakingError) {
        console.error('Staking fetch error:', stakingError);
        throw stakingError;
      }
      
      const fetchedDonationBalance = Number(stakingData?.donation_balance) || 0;
      console.log('Fetched donation balance:', fetchedDonationBalance);
      setDonationBalance(fetchedDonationBalance);

      // Fetch wallet balance from edge function
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: balanceData, error: balanceError } = await supabase.functions.invoke(
          'check-token-balance',
          {
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          }
        );

        if (balanceError) {
          console.error('Balance fetch error:', balanceError);
          throw balanceError;
        }
        
        const fetchedWalletBalance = balanceData?.balance || 0;
        console.log('Fetched wallet balance:', fetchedWalletBalance);
        setWalletBalance(fetchedWalletBalance);
      }
    } catch (error) {
      console.error('Error fetching balances:', error);
      toast({
        title: "Error",
        description: "Failed to fetch balances",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDonate = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please connect your wallet to donate",
        variant: "destructive",
      });
      navigate("/connect-wallet");
      return;
    }

    const amount = parseFloat(donateAmount);
    
    console.log('Attempting to donate:', amount, 'Available donation balance:', donationBalance);
    
    if (!donateAmount || amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid donation amount",
        variant: "destructive",
      });
      return;
    }

    if (amount > donationBalance) {
      toast({
        title: "Insufficient balance",
        description: `You only have ${donationBalance.toFixed(2)} $FUND in your donation balance`,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      console.log('Updating donation balance from', donationBalance, 'to', donationBalance - amount);
      
      // Deduct from donation balance
      const { error: updateError } = await supabase
        .from('staking')
        .update({ 
          donation_balance: donationBalance - amount 
        })
        .eq('user_id', user.id);

      if (updateError) {
        console.error('Update error:', updateError);
        throw updateError;
      }

      // Record donation
      const { error: donationError } = await supabase
        .from('impact_pool_donations')
        .insert({
          pool_name: pool.title,
          amount: amount,
          transaction_hash: `0x${Math.random().toString(16).slice(2, 66)}`,
          transaction_url: `https://solscan.io/tx/simulated_${Date.now()}`,
          donor_name: user.user_metadata?.display_name || null
        });

      if (donationError) {
        console.error('Donation insert error:', donationError);
        throw donationError;
      }

      toast({
        title: "Donation successful!",
        description: `Thank you for donating ${amount.toFixed(2)} $FUND to ${pool.title}`,
      });
      
      setDonateAmount("");
      setShowDonate(false);
      setDonationBalance(donationBalance - amount);
    } catch (error) {
      console.error('Error processing donation:', error);
      toast({
        title: "Donation failed",
        description: "There was an error processing your donation",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative h-48 overflow-hidden">
          <img
            src={pool.imageUrl}
            alt={pool.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4">
            <div className="bg-primary/90 backdrop-blur-sm p-2 rounded-full">
              <Icon className="w-5 h-5 text-primary-foreground" />
            </div>
          </div>
        </div>

        <CardHeader className="pb-3">
          <h3 className="font-bold text-lg line-clamp-2">{pool.title}</h3>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {pool.description}
          </p>

          <div className="flex items-center justify-between text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Total Raised</p>
              <span className="font-semibold text-lg">
                ${pool.totalDonations.toLocaleString()}
              </span>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Backers</p>
              <div className="flex items-center gap-1 justify-end">
                <Users className="w-4 h-4" />
                <span className="font-semibold">{pool.backers.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => setShowDetails(true)}
            >
              Details
            </Button>
            <Button
              variant="default"
              size="sm"
              className="flex-1"
              onClick={() => setShowDonate(true)}
            >
              Donate
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Icon className="w-5 h-5" />
              {pool.title}
            </DialogTitle>
            <DialogDescription>Impact Pool Details</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <img
              src={pool.imageUrl}
              alt={pool.title}
              className="w-full h-64 object-cover rounded-lg"
            />

            <div className="space-y-2">
              <h4 className="font-semibold">About This Pool</h4>
              <p className="text-sm text-muted-foreground">{pool.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="text-2xl font-bold">${pool.totalDonations.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Total Raised</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{pool.backers.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Backers</p>
              </div>
            </div>

            {pool.foundations && pool.foundations.length > 0 && (
              <div className="space-y-2 p-4 bg-muted/30 rounded-lg">
                <h4 className="font-semibold flex items-center gap-2">
                  Supported Foundations
                  <Badge variant="secondary" className="text-xs">Crypto Accepted</Badge>
                </h4>
                <ul className="space-y-2">
                  {pool.foundations.map((foundation, index) => (
                    <li key={index} className="text-sm flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {foundation.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Donate Dialog */}
      <Dialog open={showDonate} onOpenChange={setShowDonate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Donate to {pool.title}</DialogTitle>
            <DialogDescription>
              Support this cause by making a donation
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Balance Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-muted/50 rounded-lg p-3 border border-border">
                <div className="flex items-center gap-2 mb-1">
                  <Wallet className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Wallet Balance</span>
                </div>
                <p className="text-lg font-bold">
                  {loading ? '...' : walletBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-muted-foreground">$FUND tokens</p>
              </div>
              
              <div className="bg-primary/10 rounded-lg p-3 border border-primary/20">
                <div className="flex items-center gap-2 mb-1">
                  <Gift className="w-4 h-4 text-primary" />
                  <span className="text-xs text-primary">Donation Balance</span>
                </div>
                <p className="text-lg font-bold text-primary">
                  {loading ? '...' : donationBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-muted-foreground">Available to donate</p>
              </div>
            </div>

            <div className="bg-muted/30 rounded-lg p-3 text-sm text-muted-foreground">
              Donations use your Donation Balance from staking rewards
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="amount">Amount to Donate</Label>
                <Button
                  variant="link"
                  size="sm"
                  className="h-auto p-0 text-xs"
                  onClick={() => setDonateAmount(donationBalance.toString())}
                  disabled={loading || donationBalance <= 0}
                >
                  MAX
                </Button>
              </div>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={donateAmount}
                onChange={(e) => setDonateAmount(e.target.value)}
                disabled={loading}
                max={donationBalance}
                step="0.01"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              {[10, 50, 100].map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  size="sm"
                  onClick={() => setDonateAmount(amount.toString())}
                  disabled={loading || amount > donationBalance}
                >
                  {amount} $FUND
                </Button>
              ))}
            </div>

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1" 
                onClick={() => setShowDonate(false)}
                disabled={loading}
              >
                CANCEL
              </Button>
              <Button 
                className="flex-1 bg-primary" 
                onClick={handleDonate}
                disabled={loading || !donateAmount || parseFloat(donateAmount) <= 0 || parseFloat(donateAmount) > donationBalance}
              >
                {loading ? 'Processing...' : 'BACK THIS POOL'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImpactPoolCard;
