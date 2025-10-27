import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Calendar, 
  Copy,
  LogOut,
  Wallet,
  Target,
  TrendingUp,
  CheckCircle2,
  Upload,
  Loader2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Token } from "@/contexts/TokenContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Profile = () => {
  const { user, profile, loading, signOut, isWalletConnected } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [myFundingPools, setMyFundingPools] = useState<Token[]>([]);
  const [loadingPools, setLoadingPools] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/connect-wallet');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user?.id) {
      fetchMyFundingPools();
    }
  }, [user?.id]);

  const fetchMyFundingPools = async () => {
    if (!user?.id) return;
    
    try {
      setLoadingPools(true);
      const { data, error } = await supabase
        .from('tokens')
        .select('*')
        .eq('creator_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMyFundingPools(data || []);
    } catch (error) {
      console.error('Error fetching funding pools:', error);
      toast({
        title: "Error",
        description: "Failed to load your funding pools",
        variant: "destructive",
      });
    } finally {
      setLoadingPools(false);
    }
  };

  const handleClaimFunds = async (poolId: string, poolName: string) => {
    toast({
      title: "Claiming Funds",
      description: `Processing claim for ${poolName}...`,
    });
    
    // TODO: Implement actual claim logic
    setTimeout(() => {
      toast({
        title: "Funds Claimed! 🎉",
        description: `Successfully claimed funds from ${poolName}`,
      });
    }, 1500);
  };

  const formatFundAmount = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString();
  };

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    toast({
      title: "Copied!",
      description: "Address copied to clipboard",
    });
  };

  const handleDisconnect = async () => {
    try {
      await signOut();
      toast({
        title: "Disconnected",
        description: "Your wallet has been disconnected",
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to disconnect wallet",
        variant: "destructive",
      });
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user?.id) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please upload an image smaller than 2MB",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploadingImage(true);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Delete old avatar if exists
      if (profile?.avatar_url) {
        const oldPath = profile.avatar_url.split('/').pop();
        if (oldPath) {
          await supabase.storage
            .from('avatars')
            .remove([`${user.id}/${oldPath}`]);
        }
      }

      // Upload new avatar
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Profile image updated successfully",
      });

      // Refresh the page to show new avatar
      window.location.reload();
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload profile image",
        variant: "destructive",
      });
      setAvatarPreview(null);
    } finally {
      setUploadingImage(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user || !isWalletConnected) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-6">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6 text-center">
              <User className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-bold mb-2">Wallet Required</h2>
              <p className="text-muted-foreground mb-6">
                Please connect your wallet to access your profile
              </p>
              <Button onClick={() => navigate('/connect-wallet')} className="w-full">
                Connect Wallet
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src={profile?.avatar_url || ''} />
                <AvatarFallback>
                  {profile?.display_name?.charAt(0) || profile?.username?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">
                  {profile?.display_name || 'Anonymous User'}
                </h1>
                <p className="text-muted-foreground mb-2">@{profile?.username}</p>
                
                <div className="flex flex-wrap gap-4 items-center">
                  <div className="flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-mono">
                      {profile?.wallet_address?.slice(0, 6)}...{profile?.wallet_address?.slice(-4)}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopyAddress(profile?.wallet_address || '')}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    Joined {new Date(profile?.created_at || '').toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Total Raised</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">${(profile?.total_raised || 0).toFixed(2)}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Total Donated</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">${(profile?.total_donated || 0).toFixed(2)}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Net Impact</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                ${((profile?.total_raised || 0) - (profile?.total_donated || 0)).toFixed(2)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="pools" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pools">My Funding Pools</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pools" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  My Funding Pools
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingPools ? (
                  <div className="text-center py-8">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading your pools...</p>
                  </div>
                ) : myFundingPools.length === 0 ? (
                  <div className="text-center py-12">
                    <Target className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-xl font-semibold mb-2">No Funding Pools Yet</h3>
                    <p className="text-muted-foreground mb-6">
                      Create your first funding pool to start raising funds
                    </p>
                    <Button onClick={() => navigate('/launch-token')}>
                      Create Funding Pool
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {myFundingPools.map((pool) => {
                      const progressPercent = pool.goal_amount > 0 
                        ? Math.min((pool.current_amount / pool.goal_amount) * 100, 100)
                        : 0;
                      const isFullyFunded = progressPercent >= 100;
                      
                      return (
                        <Card key={pool.id} className="hover:border-primary/50 transition-colors">
                          <CardContent className="pt-6">
                            <div className="flex flex-col md:flex-row gap-6">
                              {/* Pool Image */}
                              {pool.image_url && (
                                <img
                                  src={pool.image_url}
                                  alt={pool.name}
                                  className="w-full md:w-32 h-32 rounded-lg object-cover"
                                />
                              )}
                              
                              {/* Pool Info */}
                              <div className="flex-1 space-y-4">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <div className="flex items-center gap-2 mb-1">
                                      <h3 className="text-xl font-bold">{pool.name}</h3>
                                      <Badge variant="outline">{pool.symbol}</Badge>
                                      {isFullyFunded && (
                                        <Badge className="bg-green-500/20 text-green-500 border-green-500/50">
                                          <CheckCircle2 className="w-3 h-3 mr-1" />
                                          Funded
                                        </Badge>
                                      )}
                                    </div>
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                      {pool.description || 'No description'}
                                    </p>
                                  </div>
                                </div>
                                
                                {/* Progress */}
                                <div>
                                  <div className="flex items-baseline justify-between mb-2">
                                    <span className="text-lg font-bold text-primary">
                                      {formatFundAmount(pool.current_amount)} $FUND
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                      of {formatFundAmount(pool.goal_amount)} $FUND
                                    </span>
                                  </div>
                                  <Progress value={progressPercent} className="h-2 mb-1" />
                                  <div className="flex justify-between items-center">
                                    <span className="text-xs text-muted-foreground">
                                      {progressPercent.toFixed(1)}% funded
                                    </span>
                                    {pool.price_change_24h !== undefined && (
                                      <span className={`text-xs flex items-center gap-1 ${
                                        pool.price_change_24h >= 0 ? 'text-green-500' : 'text-red-500'
                                      }`}>
                                        <TrendingUp className="w-3 h-3" />
                                        {pool.price_change_24h >= 0 ? '+' : ''}{pool.price_change_24h.toFixed(2)}%
                                      </span>
                                    )}
                                  </div>
                                </div>
                                
                                {/* Actions */}
                                <div className="flex gap-3">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => navigate(`/token/${pool.id}`)}
                                  >
                                    View Details
                                  </Button>
                                  <Button
                                    variant={isFullyFunded ? "cyber" : "outline"}
                                    size="sm"
                                    disabled={!isFullyFunded}
                                    onClick={() => handleClaimFunds(pool.id, pool.name)}
                                    className={!isFullyFunded ? "opacity-60 cursor-not-allowed" : ""}
                                  >
                                    <Wallet className="w-4 h-4 mr-2" />
                                    {isFullyFunded ? "Claim Funds" : "Claim at 100%"}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Image</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-6">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={avatarPreview || profile?.avatar_url || ''} />
                    <AvatarFallback>
                      {profile?.display_name?.charAt(0) || profile?.username?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <Label htmlFor="avatar-upload" className="text-sm font-medium mb-2 block">
                      Upload Profile Picture
                    </Label>
                    <p className="text-sm text-muted-foreground mb-4">
                      JPG, PNG or WEBP. Max size 2MB.
                    </p>
                    <Input
                      id="avatar-upload"
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingImage}
                      variant="outline"
                    >
                      {uploadingImage ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Image
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Username</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    @{profile?.username || profile?.wallet_address?.slice(0, 8)}
                  </p>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <Wallet className="w-4 h-4" />
                    Connected Wallet
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2 font-mono">
                    {profile?.wallet_address}
                  </p>
                  <Button
                    variant="destructive"
                    onClick={handleDisconnect}
                    className="mt-2"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Disconnect Wallet
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <Footer />
    </div>
  );
};

export default Profile;