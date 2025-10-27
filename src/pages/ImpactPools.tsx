import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ImpactPoolCard from "@/components/ImpactPoolCard";
import { Globe, Heart, Droplet } from "lucide-react";

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

const ImpactPools = () => {
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {impactPools.map((pool) => (
            <ImpactPoolCard key={pool.id} pool={pool} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ImpactPools;
