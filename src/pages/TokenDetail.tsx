import Navbar from "@/components/Navbar";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, ExternalLink, Globe, Send, Heart, Users2, Target, Clock, MessageCircle, Wallet, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";
import { useTokens } from "@/contexts/TokenContext";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TokenDetail = () => {
  const { tokenId } = useParams();
  const navigate = useNavigate();
  const { tokens } = useTokens();
  const { toast } = useToast();
  const { user, isWalletConnected } = useAuth();
  const [currentToken, setCurrentToken] = useState<any>(tokens.find(t => t.id === tokenId));
  const [creatorProfile, setCreatorProfile] = useState<any>(null);
  const [hearts, setHearts] = useState(0);
  const [backers, setBackers] = useState(0);
  const [hasGivenHeart, setHasGivenHeart] = useState(false);
  const [isTogglingHeart, setIsTogglingHeart] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [donations, setDonations] = useState<any[]>([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [answerText, setAnswerText] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (tokenId) {
      loadTokenData();
      fetchHeartData();
      fetchBackerCount();
      fetchQuestions();
      fetchDonations();
    }
  }, [tokenId, user?.id]);

  const loadTokenData = async () => {
    const { data: tokenData } = await supabase
      .from('tokens')
      .select('*')
      .eq('id', tokenId)
      .single();
    
    if (tokenData) {
      setCurrentToken(tokenData);
      
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', tokenData.creator_id)
        .single();
      
      if (profileData) {
        setCreatorProfile(profileData);
      }
    }
  };

  const fetchHeartData = async () => {
    if (!tokenId) return;
    
    try {
      const { count: heartCount } = await supabase
        .from('token_hearts')
        .select('*', { count: 'exact', head: true })
        .eq('token_id', tokenId);

      setHearts(heartCount || 0);

      if (user?.id) {
        const { data } = await supabase
          .from('token_hearts')
          .select('id')
          .eq('token_id', tokenId)
          .eq('user_id', user.id)
          .maybeSingle();

        setHasGivenHeart(!!data);
      }
    } catch (error) {
      console.error('Error fetching heart data:', error);
    }
  };

  const fetchBackerCount = async () => {
    if (!tokenId) return;
    
    try {
      const { data } = await supabase
        .from('token_donations')
        .select('user_id')
        .eq('token_id', tokenId);

      const uniqueBackers = new Set(data?.map(d => d.user_id) || []).size;
      setBackers(uniqueBackers);
    } catch (error) {
      console.error('Error fetching backer count:', error);
    }
  };

  const fetchDonations = async () => {
    if (!tokenId) return;
    
    try {
      const { data, error } = await supabase
        .from('token_donations')
        .select(`
          *,
          profiles:user_id (
            display_name,
            username,
            avatar_url
          )
        `)
        .eq('token_id', tokenId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setDonations(data || []);
    } catch (error) {
      console.error('Error fetching donations:', error);
    }
  };

  const handleGiveHeart = async () => {
    if (!user || !isWalletConnected) {
      toast({
        title: "Connect your wallet",
        description: "Please connect your wallet to show support",
        variant: "destructive",
      });
      return;
    }

    if (isTogglingHeart) return;

    try {
      setIsTogglingHeart(true);

      if (hasGivenHeart) {
        const { error } = await supabase
          .from('token_hearts')
          .delete()
          .eq('token_id', tokenId!)
          .eq('user_id', user.id);

        if (error) throw error;

        setHearts(prev => prev - 1);
        setHasGivenHeart(false);
        toast({
          title: "Heart removed",
          description: `You've removed your support from ${currentToken?.name}`,
        });
      } else {
        const { error } = await supabase
          .from('token_hearts')
          .insert({
            token_id: tokenId!,
            user_id: user.id,
          });

        if (error) throw error;

        setHearts(prev => prev + 1);
        setHasGivenHeart(true);
        toast({
          title: "Heart given! ❤️",
          description: `You're now supporting ${currentToken?.name}`,
        });
      }
    } catch (error: any) {
      console.error('Error toggling heart:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update heart status",
        variant: "destructive",
      });
    } finally {
      setIsTogglingHeart(false);
    }
  };

  const fetchQuestions = async () => {
    if (!tokenId) return;
    
    try {
      const { data, error } = await supabase
        .from('token_questions')
        .select(`
          *,
          profiles:user_id (
            display_name,
            username,
            avatar_url
          )
        `)
        .eq('token_id', tokenId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuestions(data || []);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handleAskQuestion = async () => {
    if (!user || !isWalletConnected) {
      toast({
        title: "Connect your wallet",
        description: "Please connect your wallet to ask questions",
        variant: "destructive",
      });
      return;
    }

    if (!newQuestion.trim()) {
      toast({
        title: "Empty question",
        description: "Please enter a question",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const { error } = await supabase
        .from('token_questions')
        .insert({
          token_id: tokenId!,
          user_id: user.id,
          question: newQuestion.trim(),
        });

      if (error) throw error;

      setNewQuestion("");
      await fetchQuestions();
      toast({
        title: "Question posted!",
        description: "The fund creator will be notified",
      });
    } catch (error: any) {
      console.error('Error posting question:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to post question",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAnswerQuestion = async (questionId: string) => {
    const answer = answerText[questionId]?.trim();
    
    if (!answer) {
      toast({
        title: "Empty answer",
        description: "Please enter an answer",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('token_questions')
        .update({
          answer: answer,
          answered_at: new Date().toISOString(),
        })
        .eq('id', questionId);

      if (error) throw error;

      setAnswerText(prev => ({ ...prev, [questionId]: "" }));
      await fetchQuestions();
      toast({
        title: "Answer posted!",
        description: "Your answer has been published",
      });
    } catch (error: any) {
      console.error('Error posting answer:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to post answer",
        variant: "destructive",
      });
    }
  };

  const isCreator = user?.id === currentToken?.creator_id;

  const formatNumber = (num: number | undefined) => {
    if (num === undefined || num === null) return '0';
    if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(2)}K`;
    return num.toLocaleString();
  };

  const formatFundAmount = (num: number | undefined) => {
    const formatted = formatNumber(num);
    return `${formatted} $FUND`;
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const created = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - created.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  if (!currentToken) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-12 h-12 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading fund pool...</p>
          </div>
        </div>
      </div>
    );
  }

  const progressPercent = currentToken.goal_amount > 0 
    ? Math.min((currentToken.current_amount / currentToken.goal_amount) * 100, 100)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Right Sidebar - Profile & Creator Info */}
          <div className="lg:col-span-3 space-y-6 lg:order-2">
            {/* Fund Pool Profile */}
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="w-32 h-32 mx-auto mb-4 rounded-lg overflow-hidden border-2 border-border">
                  {currentToken.image_url ? (
                    <img src={currentToken.image_url} alt={currentToken.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-primary/20 flex items-center justify-center">
                      <span className="text-4xl font-bold text-primary">{currentToken.symbol.slice(0, 2)}</span>
                    </div>
                  )}
                </div>
                <h2 className="text-2xl font-bold mb-2">{currentToken.name}</h2>
                <Badge variant="outline" className="mb-4">{currentToken.symbol}</Badge>
                <p className="text-sm text-muted-foreground mb-4">{currentToken.description}</p>
                
                {/* Social Links */}
                <div className="space-y-2">
                  {currentToken.website_url && (
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <a href={currentToken.website_url} target="_blank" rel="noopener noreferrer">
                        <Globe className="w-4 h-4 mr-2" />
                        Website
                      </a>
                    </Button>
                  )}
                  {currentToken.x_url && (
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <a href={currentToken.x_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        X
                      </a>
                    </Button>
                  )}
                  {currentToken.telegram_url && (
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <a href={currentToken.telegram_url} target="_blank" rel="noopener noreferrer">
                        <Send className="w-4 h-4 mr-2" />
                        Telegram
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Creator Info */}
            {creatorProfile && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Creator</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={creatorProfile.avatar_url || ''} />
                      <AvatarFallback className="bg-primary/20 text-primary">
                        {creatorProfile.display_name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{creatorProfile.display_name || 'Anonymous'}</p>
                      <p className="text-sm text-muted-foreground">@{creatorProfile.username}</p>
                    </div>
                  </div>
                  <div className="pt-3 border-t space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Wallet</span>
                      <span className="font-mono text-xs">
                        {creatorProfile.wallet_address?.slice(0, 6)}...{creatorProfile.wallet_address?.slice(-4)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Joined</span>
                      <span>{new Date(creatorProfile.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Raised</span>
                      <span className="font-semibold">${formatNumber(creatorProfile.total_raised)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Community</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users2 className="w-5 h-5 text-muted-foreground" />
                    <span className="text-sm">Backers</span>
                  </div>
                  <span className="text-xl font-bold">{formatNumber(backers)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-accent" />
                    <span className="text-sm">Hearts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-accent">{formatNumber(hearts)}</span>
                    <Button
                      size="sm"
                      variant={hasGivenHeart ? "default" : "outline"}
                      onClick={handleGiveHeart}
                      disabled={isTogglingHeart}
                    >
                      <Heart className={`w-4 h-4 ${hasGivenHeart ? 'fill-current' : ''}`} />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-muted-foreground" />
                    <span className="text-sm">Launched</span>
                  </div>
                  <span className="text-sm">{getTimeAgo(currentToken.created_at)}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Now on Left */}
          <div className="lg:col-span-9 space-y-6 lg:order-1">
            {/* Funding Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Funding Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Raised</p>
                    <p className="text-3xl font-bold text-primary">{formatFundAmount(currentToken.current_amount)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Goal</p>
                    <p className="text-3xl font-bold">{formatFundAmount(currentToken.goal_amount)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Progress</p>
                    <p className="text-3xl font-bold text-accent">{progressPercent.toFixed(1)}%</p>
                  </div>
                </div>
                <Progress value={progressPercent} className="h-3" />
                <Button className="w-full" size="lg" disabled={!isWalletConnected}>
                  <Wallet className="w-4 h-4 mr-2" />
                  {isWalletConnected ? 'Support This Pool' : 'Connect Wallet to Support'}
                </Button>
              </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs defaultValue="donors" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="donors">Recent Donors</TabsTrigger>
                <TabsTrigger value="qa">Q&A ({questions.length})</TabsTrigger>
              </TabsList>

              {/* Donors Table */}
              <TabsContent value="donors">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Donations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {donations.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No donations yet. Be the first to support!</p>
                      </div>
                    ) : (
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Donor</TableHead>
                              <TableHead>Amount</TableHead>
                              <TableHead className="text-right">Time</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {donations.map((donation) => (
                              <TableRow key={donation.id}>
                                <TableCell>
                                  <div className="flex items-center gap-3">
                                    <Avatar className="w-8 h-8">
                                      <AvatarImage src={donation.profiles?.avatar_url || ''} />
                                      <AvatarFallback className="bg-primary/20 text-primary text-xs">
                                        {donation.profiles?.display_name?.charAt(0) || 'A'}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <p className="font-medium text-sm">
                                        {donation.profiles?.display_name || 'Anonymous'}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        @{donation.profiles?.username || 'anonymous'}
                                      </p>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell className="font-semibold">
                                  {formatFundAmount(donation.amount)}
                                </TableCell>
                                <TableCell className="text-right text-sm text-muted-foreground">
                                  {getTimeAgo(donation.created_at)}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Q&A */}
              <TabsContent value="qa">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircle className="w-5 h-5" />
                      Questions & Answers
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Ask Question */}
                    <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
                      <Textarea
                        placeholder="Ask the creator a question..."
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                        className="min-h-[100px]"
                        disabled={!user || !isWalletConnected}
                      />
                      <Button
                        onClick={handleAskQuestion}
                        disabled={!user || !isWalletConnected || isSubmitting || !newQuestion.trim()}
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        {isSubmitting ? 'Posting...' : 'Ask Question'}
                      </Button>
                      {(!user || !isWalletConnected) && (
                        <p className="text-sm text-muted-foreground">Connect wallet to ask questions</p>
                      )}
                    </div>

                    {/* Questions List */}
                    <div className="space-y-4">
                      {questions.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                          <p>No questions yet. Be the first to ask!</p>
                        </div>
                      ) : (
                        questions.map((q) => (
                          <div key={q.id} className="p-4 border rounded-lg space-y-3">
                            <div className="flex gap-3">
                              <Avatar className="w-10 h-10">
                                <AvatarImage src={q.profiles?.avatar_url || ''} />
                                <AvatarFallback className="bg-primary/20">
                                  {q.profiles?.display_name?.charAt(0) || 'U'}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-semibold text-sm">
                                    {q.profiles?.display_name || 'Anonymous'}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {getTimeAgo(q.created_at)}
                                  </span>
                                </div>
                                <p className="text-sm">{q.question}</p>
                              </div>
                            </div>

                            {q.answer ? (
                              <div className="ml-13 pl-4 border-l-2 border-primary">
                                <Badge variant="outline" className="mb-2">Creator</Badge>
                                <p className="text-sm">{q.answer}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {getTimeAgo(q.answered_at)}
                                </p>
                              </div>
                            ) : isCreator ? (
                              <div className="ml-13 space-y-2">
                                <Textarea
                                  placeholder="Write your answer..."
                                  value={answerText[q.id] || ''}
                                  onChange={(e) => setAnswerText(prev => ({ ...prev, [q.id]: e.target.value }))}
                                  className="min-h-[80px]"
                                />
                                <Button
                                  onClick={() => handleAnswerQuestion(q.id)}
                                  size="sm"
                                  disabled={!answerText[q.id]?.trim()}
                                >
                                  Post Answer
                                </Button>
                              </div>
                            ) : (
                              <p className="ml-13 text-xs text-muted-foreground italic">
                                Awaiting response...
                              </p>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenDetail;
