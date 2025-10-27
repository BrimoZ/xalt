import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Upload, Globe, Send, Users, User, X } from "lucide-react";
import { useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTokens } from "@/contexts/TokenContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const LaunchToken = () => {
  const { user, profile, isWalletConnected } = useAuth();
  const { refreshTokens } = useTokens();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    campaignName: "",
    description: "",
    goalAmount: "",
    category: "",
    x: "",
    telegram: "",
    discord: ""
  });
  const [isLaunching, setIsLaunching] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = async (files: FileList) => {
    if (!user) return;
    
    // Limit to 5 images
    if (uploadedImages.length + files.length > 5) {
      toast({
        title: "Too Many Images",
        description: "You can upload a maximum of 5 images.",
        variant: "destructive",
      });
      return;
    }

    setUploadingImage(true);
    const newImages: string[] = [];
    
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}-${i}.${fileExt}`;
        const filePath = `fund-pools/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('token-images')
          .upload(filePath, file);

        if (uploadError) {
          throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('token-images')
          .getPublicUrl(filePath);

        newImages.push(publicUrl);
      }
      
      setUploadedImages(prev => [...prev, ...newImages]);
      
      toast({
        title: "Images Uploaded",
        description: `${newImages.length} image(s) uploaded successfully.`,
      });
    } catch (error: any) {
      console.error('Error uploading images:', error);
      const errorMessage = error?.message || 'Failed to upload images. Please try again.';
      toast({
        title: "Upload Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      // Validate file types
      for (let i = 0; i < files.length; i++) {
        if (!files[i].type.startsWith('image/')) {
          toast({
            title: "Invalid File Type",
            description: "Please select only image files (PNG, JPG, GIF, etc.)",
            variant: "destructive",
          });
          return;
        }

        // Validate file size (max 5MB each)
        if (files[i].size > 5 * 1024 * 1024) {
          toast({
            title: "File Too Large",
            description: "Each image must be smaller than 5MB.",
            variant: "destructive",
          });
          return;
        }
      }

      handleImageUpload(files);
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleLaunch = async () => {
    if (!user || !isWalletConnected) {
      toast({
        title: "Wallet Required",
        description: "Please connect your Phantom wallet to launch a fund pool.",
        variant: "destructive",
      });
      navigate('/connect-wallet');
      return;
    }

    // Validate required fields
    if (!formData.campaignName || !formData.description || !formData.goalAmount || !formData.category) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields including category.",
        variant: "destructive",
      });
      return;
    }

    setIsLaunching(true);

    try {
      // Create the fund pool directly in database
      const { data: newPool, error: insertError } = await supabase
        .from('tokens')
        .insert([{
          creator_id: user.id,
          name: formData.campaignName,
          symbol: formData.campaignName.substring(0, 4).toUpperCase(),
          description: formData.description,
          goal_amount: parseFloat(formData.goalAmount),
          current_amount: 0,
          current_price: 0,
          price_change_24h: 0,
          images: uploadedImages.length > 0 ? uploadedImages : [`https://api.dicebear.com/7.x/identicon/svg?seed=${formData.campaignName}`],
          image_url: uploadedImages.length > 0 ? uploadedImages[0] : `https://api.dicebear.com/7.x/identicon/svg?seed=${formData.campaignName}`,
          x_url: formData.x || null,
          telegram_url: formData.telegram || null,
          discord_url: formData.discord || null,
        }])
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      // Refresh the tokens list
      await refreshTokens();

      toast({
        title: "Fund Pool Launched Successfully! 🚀",
        description: `${formData.campaignName} has been created and is now accepting donations.`,
      });

      // Navigate to the new fund pool page
      navigate(`/token/${newPool?.id}`);
    } catch (error) {
      console.error('Error launching fund pool:', error);
      toast({
        title: "Launch Failed",
        description: "There was an error launching your fund pool. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLaunching(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Navbar />
      
      {/* Wallet Check */}
      {!user || !isWalletConnected ? (
        <div className="max-w-3xl mx-auto px-6 py-16">
          <Card className="bg-card/60 border-primary/20 backdrop-blur-sm shadow-2xl">
            <CardContent className="pt-6 text-center">
              <User className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-bold mb-2">Wallet Required</h2>
              <p className="text-muted-foreground mb-6">
                You need to connect your Phantom wallet to launch a fund pool on FundMe.
              </p>
              <Button onClick={() => navigate('/connect-wallet')} className="w-full">
                Connect Wallet
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto px-6 py-16">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6">
              <Users className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Fund Pool Platform</span>
            </div>
            <h1 className="text-6xl font-orbitron font-bold text-foreground mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
              Launch Your Fund Pool
            </h1>
            <p className="text-muted-foreground text-xl max-w-2xl mx-auto leading-relaxed">
              Create your fundraising campaign and start receiving donations in $FUND tokens. 
              Share your story with the community and achieve your goals.
            </p>
          </div>

          {/* Fund Pool Form */}
          <Card className="bg-card/60 border-primary/20 backdrop-blur-sm shadow-2xl">
            <CardHeader className="pb-8">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                Fund Pool Configuration
              </CardTitle>
              <p className="text-muted-foreground">Set up your fundraising campaign details</p>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Campaign Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-orbitron font-semibold text-foreground border-b border-border pb-2">
                  Campaign Information
                </h3>
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="campaignName" className="text-base font-medium">Campaign Name *</Label>
                    <Input 
                      id="campaignName" 
                      value={formData.campaignName}
                      onChange={(e) => handleInputChange('campaignName', e.target.value)}
                      placeholder="e.g., Help Build Community Center" 
                      className="h-12 bg-background/80 border-border/50 focus:border-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="goalAmount" className="text-base font-medium">Funding Goal (in $FUND) *</Label>
                    <Input 
                      id="goalAmount" 
                      type="number"
                      value={formData.goalAmount}
                      onChange={(e) => handleInputChange('goalAmount', e.target.value)}
                      placeholder="e.g., 10000" 
                      className="h-12 bg-background/80 border-border/50 focus:border-primary"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="category" className="text-base font-medium">Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                      <SelectTrigger className="h-12 bg-background/80 border-border/50">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border-border z-50">
                        <SelectItem value="Medical & Healthcare">Medical & Healthcare</SelectItem>
                        <SelectItem value="Education & Scholarship">Education & Scholarship</SelectItem>
                        <SelectItem value="Community Development">Community Development</SelectItem>
                        <SelectItem value="Emergency & Disaster Relief">Emergency & Disaster Relief</SelectItem>
                        <SelectItem value="Environmental & Wildlife">Environmental & Wildlife</SelectItem>
                        <SelectItem value="Arts & Culture">Arts & Culture</SelectItem>
                        <SelectItem value="Sports & Recreation">Sports & Recreation</SelectItem>
                        <SelectItem value="Technology & Innovation">Technology & Innovation</SelectItem>
                        <SelectItem value="Business & Entrepreneurship">Business & Entrepreneurship</SelectItem>
                        <SelectItem value="Social Causes">Social Causes</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="description" className="text-base font-medium">Campaign Story *</Label>
                  <Textarea 
                    id="description" 
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Tell your story... Why are you raising funds? What will the money be used for? Share your vision and goals..."
                    className="min-h-40 bg-background/80 border-border/50 focus:border-primary resize-none"
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-base font-medium">Campaign Images (Max 5)</Label>
                  {uploadedImages.length > 0 ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {uploadedImages.map((image, index) => (
                          <div key={index} className="relative group border-2 border-primary/20 rounded-lg overflow-hidden aspect-video">
                            <img 
                              src={image} 
                              alt={`Campaign preview ${index + 1}`} 
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => removeImage(index)}
                                className="gap-2"
                              >
                                <X className="w-4 h-4" />
                                Remove
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                      {uploadedImages.length < 5 && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full"
                          disabled={uploadingImage}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          {uploadingImage ? "Uploading..." : `Add More Images (${uploadedImages.length}/5)`}
                        </Button>
                      )}
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
                          {uploadingImage ? "Uploading images..." : "Click to upload campaign images"}
                        </p>
                        <p className="text-muted-foreground text-sm">
                          {uploadingImage ? "Please wait..." : "PNG, JPG, GIF up to 5MB each (Max 5 images)"}
                        </p>
                      </div>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={uploadingImage}
                  />
                  <p className="text-xs text-muted-foreground">
                    Upload compelling images that represent your campaign. Multiple images help tell your story better.
                  </p>
                </div>
              </div>

              {/* Social Links */}
              <div className="space-y-6">
                <h3 className="text-lg font-orbitron font-semibold text-foreground border-b border-border pb-2">
                  Social & Contact Links
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="x" className="flex items-center gap-2 text-base font-medium">
                      <X className="w-4 h-4" />
                      X (Twitter)
                    </Label>
                    <Input 
                      id="x" 
                      value={formData.x}
                      onChange={(e) => handleInputChange('x', e.target.value)}
                      placeholder="@username" 
                      className="h-12 bg-background/80 border-border/50 focus:border-primary"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="telegram" className="flex items-center gap-2 text-base font-medium">
                      <Send className="w-4 h-4" />
                      Telegram
                    </Label>
                    <Input 
                      id="telegram" 
                      value={formData.telegram}
                      onChange={(e) => handleInputChange('telegram', e.target.value)}
                      placeholder="t.me/username" 
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
                      placeholder="discord.gg/username" 
                      className="h-12 bg-background/80 border-border/50 focus:border-primary"
                    />
                  </div>
                </div>
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
                      <Users className="w-5 h-5 mr-2" />
                      Launch Fund Pool
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
        </div>
      )}

      <Footer />
    </div>
  );
};

export default LaunchToken;