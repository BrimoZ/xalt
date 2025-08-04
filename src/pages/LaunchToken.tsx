import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Upload, Zap, Globe, Send, MessageCircle, Sparkles, Clock, Users, User, X, ImageIcon } from "lucide-react";
import { useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTokens } from "@/contexts/TokenContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const LaunchToken = () => {
  const { user, profile, isXConnected } = useAuth();
  const { addToken } = useTokens();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [launchMode, setLaunchMode] = useState("xalt");
  const [contributors, setContributors] = useState("any");
  const [formData, setFormData] = useState({
    name: "",
    symbol: "",
    description: "",
    website: "",
    x: "",
    telegram: "",
    discord: "",
    totalSupply: "",
    hardcap: ""
  });
  const [isLaunching, setIsLaunching] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = async (file: File) => {
    if (!user) return;

    setUploadingImage(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `tokens/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('token-images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('token-images')
        .getPublicUrl(filePath);

      setUploadedImage(publicUrl);
      setImageFile(file);
      
      toast({
        title: "Image Uploaded",
        description: "Your token image has been uploaded successfully.",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid File Type",
          description: "Please select an image file (PNG, JPG, GIF, etc.)",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please select an image smaller than 5MB.",
          variant: "destructive",
        });
        return;
      }

      handleImageUpload(file);
    }
  };

  const removeImage = () => {
    setUploadedImage(null);
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleLaunch = async () => {
    if (!user || !isXConnected) {
      toast({
        title: "Authentication Required",
        description: "Please connect your X account to launch a token.",
        variant: "destructive",
      });
      navigate('/connect-x');
      return;
    }

    // Validate required fields
    if (!formData.name || !formData.symbol || !formData.description || !formData.totalSupply || !formData.hardcap) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLaunching(true);

    try {
      // Simulate launch delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newToken = await addToken({
        name: formData.name,
        symbol: formData.symbol.toUpperCase(),
        description: formData.description,
        website_url: formData.website || undefined,
        x_handle: formData.x || undefined,
        telegram_url: formData.telegram || undefined,
        discord_url: formData.discord || undefined,
        total_supply: formData.totalSupply,
        hardcap: formData.hardcap,
        contributor_type: contributors as 'any' | 'followers',
        creator_id: user.id,
        creator_username: profile?.x_username || profile?.username || 'unknown',
        image_url: uploadedImage || `https://api.dicebear.com/7.x/identicon/svg?seed=${formData.symbol}`
      });

      toast({
        title: "Token Launched Successfully! 🚀",
        description: `${formData.name} (${formData.symbol}) has been launched and added to live launches.`,
      });

      // Navigate to the new token page
      navigate(`/token/${newToken.id}`);
    } catch (error) {
      console.error('Error launching token:', error);
      toast({
        title: "Launch Failed",
        description: "There was an error launching your token. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLaunching(false);
    }
  };

  const launchModes = [
    {
      id: "xalt",
      name: "Xalt Mode",
      description: "Full-featured token launch with social integration",
      badge: "Popular",
      available: true,
      icon: <Sparkles className="w-5 h-5" />
    },
    {
      id: "pump",
      name: "Pump.fun Mode",
      description: "Quick launch for meme tokens",
      badge: "Coming Soon",
      available: false,
      icon: <Clock className="w-5 h-5" />
    },
    {
      id: "bonk",
      name: "Letsbonk.fun Mode",
      description: "Community-driven launch mechanism",
      badge: "Coming Soon",
      available: false,
      icon: <Users className="w-5 h-5" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Navbar />
      
      {/* Authentication Check */}
      {!user || !isXConnected ? (
        <div className="max-w-3xl mx-auto px-6 py-16">
          <Card className="bg-card/60 border-primary/20 backdrop-blur-sm shadow-2xl">
            <CardContent className="pt-6 text-center">
              <User className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-bold mb-2">X Account Required</h2>
              <p className="text-muted-foreground mb-6">
                You need to connect your X account to launch tokens on Xalt.
              </p>
              <Button onClick={() => navigate('/connect-x')} className="w-full">
                Connect X Account
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto px-6 py-16">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Token Launchpad</span>
            </div>
            <h1 className="text-6xl font-orbitron font-bold text-foreground mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
              Launch Your Token
            </h1>
            <p className="text-muted-foreground text-xl max-w-2xl mx-auto leading-relaxed">
              Create, deploy, and scale your token project with our comprehensive launch platform. 
              From concept to community in minutes.
            </p>
          </div>

          {/* Launch Mode Selection */}
          <Card className="bg-card/60 border-primary/20 backdrop-blur-sm shadow-2xl mb-12">
            <CardHeader className="pb-8">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                Choose Your Launch Mode
              </CardTitle>
              <p className="text-muted-foreground">Select the perfect launch strategy for your token</p>
            </CardHeader>
            <CardContent>
              <RadioGroup value={launchMode} onValueChange={setLaunchMode} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {launchModes.map((mode) => (
                  <div key={mode.id} className="relative">
                    <label 
                      htmlFor={mode.id}
                      className={`block p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                        mode.available 
                          ? launchMode === mode.id 
                            ? 'border-primary bg-primary/5 shadow-lg shadow-primary/20' 
                            : 'border-border hover:border-primary/50 bg-background/50'
                          : 'border-border/50 bg-background/20 opacity-60 cursor-not-allowed'
                      }`}
                    >
                      <RadioGroupItem 
                        value={mode.id} 
                        id={mode.id} 
                        disabled={!mode.available}
                        className="sr-only" 
                      />
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${mode.available ? 'bg-primary/10' : 'bg-muted/50'}`}>
                            {mode.icon}
                          </div>
                          <div>
                            <h3 className="font-orbitron font-bold text-lg">{mode.name}</h3>
                            <Badge 
                              variant={mode.available ? "default" : "secondary"}
                              className={mode.available ? "bg-primary/10 text-primary" : ""}
                            >
                              {mode.badge}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <p className="text-muted-foreground text-sm">{mode.description}</p>
                    </label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Xalt Mode Form */}
          {launchMode === "xalt" && (
            <Card className="bg-card/60 border-primary/20 backdrop-blur-sm shadow-2xl">
              <CardHeader className="pb-8">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Sparkles className="w-6 h-6 text-primary" />
                  </div>
                  Xalt Mode Configuration
                </CardTitle>
                <p className="text-muted-foreground">Configure your token details and launch parameters</p>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Basic Information */}
                <div className="space-y-6">
                  <h3 className="text-lg font-orbitron font-semibold text-foreground border-b border-border pb-2">
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="name" className="text-base font-medium">Token Name *</Label>
                      <Input 
                        id="name" 
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="e.g., SuperCoin" 
                        className="h-12 bg-background/80 border-border/50 focus:border-primary"
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="symbol" className="text-base font-medium">Symbol *</Label>
                      <Input 
                        id="symbol" 
                        value={formData.symbol}
                        onChange={(e) => handleInputChange('symbol', e.target.value.toUpperCase())}
                        placeholder="e.g., SUPER" 
                        className="h-12 bg-background/80 border-border/50 focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="description" className="text-base font-medium">Description *</Label>
                    <Textarea 
                      id="description" 
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Describe your token's purpose, utility, and vision..."
                      className="min-h-32 bg-background/80 border-border/50 focus:border-primary resize-none"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-base font-medium">Token Image</Label>
                    {uploadedImage ? (
                      <div className="relative">
                        <div className="relative group border-2 border-primary/20 rounded-xl overflow-hidden">
                          <img 
                            src={uploadedImage} 
                            alt="Token preview" 
                            className="w-full h-48 object-cover"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={removeImage}
                              className="gap-2"
                            >
                              <X className="w-4 h-4" />
                              Remove
                            </Button>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full mt-3"
                          disabled={uploadingImage}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          {uploadingImage ? "Uploading..." : "Change Image"}
                        </Button>
                      </div>
                    ) : (
                      <div 
                        className="relative group cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <div className="border-2 border-dashed border-border/50 rounded-xl p-12 text-center hover:border-primary/50 transition-all duration-300 bg-background/30">
                          <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                            {uploadingImage ? (
                              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <Upload className="w-8 h-8 text-primary" />
                            )}
                          </div>
                          <p className="text-foreground font-medium mb-2">
                            {uploadingImage ? "Uploading image..." : "Click to upload token image"}
                          </p>
                          <p className="text-muted-foreground text-sm">
                            {uploadingImage ? "Please wait..." : "PNG, JPG, GIF up to 5MB"}
                          </p>
                        </div>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      disabled={uploadingImage}
                    />
                    <p className="text-xs text-muted-foreground">
                      If no image is uploaded, a unique identicon will be generated based on your token symbol.
                    </p>
                  </div>
                </div>

                {/* Social Links */}
                <div className="space-y-6">
                  <h3 className="text-lg font-orbitron font-semibold text-foreground border-b border-border pb-2">
                    Social Links
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="website" className="flex items-center gap-2 text-base font-medium">
                        <Globe className="w-4 h-4 text-primary" />
                        Website
                      </Label>
                      <Input 
                        id="website" 
                        type="url" 
                        value={formData.website}
                        onChange={(e) => handleInputChange('website', e.target.value)}
                        placeholder="https://mytoken.com" 
                        className="h-12 bg-background/80 border-border/50 focus:border-primary"
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="x" className="flex items-center gap-2 text-base font-medium">
                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                        X (Twitter)
                      </Label>
                      <Input 
                        id="x" 
                        value={formData.x}
                        onChange={(e) => handleInputChange('x', e.target.value)}
                        placeholder="@mytoken" 
                        className="h-12 bg-background/80 border-border/50 focus:border-primary"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="telegram" className="flex items-center gap-2 text-base font-medium">
                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#0088cc]">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                        </svg>
                        Telegram
                      </Label>
                      <Input 
                        id="telegram" 
                        value={formData.telegram}
                        onChange={(e) => handleInputChange('telegram', e.target.value)}
                        placeholder="t.me/mytokengroup" 
                        className="h-12 bg-background/80 border-border/50 focus:border-primary"
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="discord" className="flex items-center gap-2 text-base font-medium">
                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#5865F2]">
                          <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0189 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
                        </svg>
                        Discord
                      </Label>
                      <Input 
                        id="discord" 
                        value={formData.discord}
                        onChange={(e) => handleInputChange('discord', e.target.value)}
                        placeholder="discord.gg/mytoken" 
                        className="h-12 bg-background/80 border-border/50 focus:border-primary"
                      />
                    </div>
                  </div>
                </div>

                {/* Token Economics */}
                <div className="space-y-6">
                  <h3 className="text-lg font-orbitron font-semibold text-foreground border-b border-border pb-2">
                    Token Economics
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="supply" className="text-base font-medium">Total Supply *</Label>
                      <Input 
                        id="supply" 
                        type="number" 
                        value={formData.totalSupply}
                        onChange={(e) => handleInputChange('totalSupply', e.target.value)}
                        placeholder="1,000,000" 
                        className="h-12 bg-background/80 border-border/50 focus:border-primary"
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="hardcap" className="text-base font-medium">Hardcap (SOL) *</Label>
                      <Input 
                        id="hardcap" 
                        type="number" 
                        step="0.1" 
                        value={formData.hardcap}
                        onChange={(e) => handleInputChange('hardcap', e.target.value)}
                        placeholder="100" 
                        className="h-12 bg-background/80 border-border/50 focus:border-primary"
                      />
                    </div>
                  </div>
                </div>

                {/* Contributors */}
                <div className="space-y-6">
                  <h3 className="text-lg font-orbitron font-semibold text-foreground border-b border-border pb-2">
                    Contributor Access
                  </h3>
                  <RadioGroup value={contributors} onValueChange={setContributors} className="space-y-4">
                    <div className="flex items-center space-x-3 p-4 rounded-lg border border-border/50 hover:border-primary/50 transition-colors">
                      <RadioGroupItem value="any" id="any-user" />
                      <Label htmlFor="any-user" className="flex-1 cursor-pointer">
                        <div className="font-medium">Any X user</div>
                        <div className="text-sm text-muted-foreground">Anyone with an X account can contribute</div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-4 rounded-lg border border-border/50 hover:border-primary/50 transition-colors">
                      <RadioGroupItem value="followers" id="followers-only" />
                      <Label htmlFor="followers-only" className="flex-1 cursor-pointer">
                        <div className="font-medium">Only Followers</div>
                        <div className="text-sm text-muted-foreground">Restricted to your X followers only</div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Launch Button */}
                <div className="pt-8 border-t border-border">
                  <Button 
                    onClick={handleLaunch}
                    disabled={isLaunching}
                    className="w-full h-14 text-lg font-orbitron font-bold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/25"
                  >
                    {isLaunching ? (
                      <>
                        <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Launching...
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5 mr-2" />
                        Launch Token
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-muted-foreground text-center mt-4">
                    By launching, you agree to our{" "}
                    <a href="#" className="text-primary hover:underline">terms and conditions</a>
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <Footer />
    </div>
  );
};

export default LaunchToken;