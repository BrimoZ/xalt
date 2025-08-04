import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import LiveLaunchesFeed from "@/components/LiveLaunchesFeed";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <LiveLaunchesFeed />
      <Footer />
    </div>
  );
};

export default Index;
