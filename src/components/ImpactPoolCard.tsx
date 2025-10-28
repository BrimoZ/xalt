import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Users, LucideIcon } from "lucide-react";
import { useState } from "react";
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
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const Icon = pool.icon;

  const handleDonate = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please connect your wallet to donate",
        variant: "destructive",
      });
      navigate("/connect-wallet");
      return;
    }

    if (!donateAmount || parseFloat(donateAmount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid donation amount",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Donation successful!",
      description: `Thank you for donating $${donateAmount} to ${pool.title}`,
    });
    
    setDonateAmount("");
    setShowDonate(false);
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
            <div className="space-y-2">
              <Label htmlFor="amount">Donation Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={donateAmount}
                onChange={(e) => setDonateAmount(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              {[10, 50, 100, 500].map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  size="sm"
                  onClick={() => setDonateAmount(amount.toString())}
                >
                  ${amount}
                </Button>
              ))}
            </div>

            <Button className="w-full" onClick={handleDonate}>
              Donate Now
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImpactPoolCard;
