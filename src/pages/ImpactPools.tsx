import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ImpactPoolCard from "@/components/ImpactPoolCard";
import { Globe, Heart, Droplet, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const impactPools = [
  {
    id: "palestine-relief",
    title: "Palestine Relief Fund",
    description: "Supporting humanitarian aid and essential supplies for families affected by the crisis in Palestine.",
    icon: Heart,
    goalAmount: 1000000,
    currentAmount: 450000,
    backers: 3420,
    imageUrl: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80"
  },
  {
    id: "clean-water",
    title: "Global Clean Water Initiative",
    description: "Providing access to clean drinking water for communities in developing regions across Africa and Asia.",
    icon: Droplet,
    goalAmount: 750000,
    currentAmount: 320000,
    backers: 2150,
    imageUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80"
  },
  {
    id: "disaster-relief",
    title: "Emergency Disaster Relief",
    description: "Rapid response fund for natural disasters and humanitarian emergencies worldwide.",
    icon: Globe,
    goalAmount: 500000,
    currentAmount: 180000,
    backers: 1890,
    imageUrl: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80"
  }
];

interface Donation {
  id: string;
  pool_name: string;
  amount: number;
  transaction_hash: string;
  transaction_url: string;
  donor_name: string | null;
  created_at: string;
}

const ImpactPools = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const { data, error } = await supabase
        .from('impact_pool_donations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDonations(data || []);
    } catch (error) {
      console.error('Error fetching donations:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-orbitron font-bold mb-4 text-foreground">
            Impact Pools
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Global funding pools supporting real-world causes and humanitarian efforts around the world.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {impactPools.map((pool) => (
            <ImpactPoolCard key={pool.id} pool={pool} />
          ))}
        </div>

        {/* Proof of Transactions Section */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-2xl font-orbitron flex items-center gap-2">
              <ExternalLink className="w-6 h-6" />
              Proof of Transactions
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              All donations are transparent and verifiable on the blockchain
            </p>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading transactions...
              </div>
            ) : donations.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No transactions yet
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Pool</TableHead>
                      <TableHead>Donor</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-center">Transaction</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {donations.map((donation) => (
                      <TableRow key={donation.id}>
                        <TableCell className="font-mono text-sm">
                          {formatDate(donation.created_at)}
                        </TableCell>
                        <TableCell className="font-medium">
                          {donation.pool_name}
                        </TableCell>
                        <TableCell>
                          {donation.donor_name || 'Anonymous'}
                        </TableCell>
                        <TableCell className="text-right font-mono font-semibold text-primary">
                          ${donation.amount.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-center">
                          <a
                            href={donation.transaction_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
                          >
                            View <ExternalLink className="w-3 h-3" />
                          </a>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default ImpactPools;
