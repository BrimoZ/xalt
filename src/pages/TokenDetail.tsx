import Navbar from "@/components/Navbar";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ExternalLink, Globe, Send, Heart, Users2, Target, Clock, MessageCircle, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useTokens } from "@/contexts/TokenContext";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
  const [newQuestion, setNewQuestion] = useState("");
  const [answerText, setAnswerText] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (tokenId) {
      loadTokenData();
      fetchHeartData();
      fetchBackerCount();
      fetchQuestions();
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

  const isFullyFunded = progressPercent >= 100;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 hover:bg-muted"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Pools
        </Button>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <Card className="overflow-hidden border-2 hover:border-primary/50 transition-all">
              <div className="relative h-64 bg-gradient-to-br from-primary/20 via-accent/10 to-background">
                {currentToken.image_url ? (
                  <img
                    src={currentToken.image_url}
                    alt={currentToken.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 bg-primary/30 rounded-2xl flex items-center justify-center backdrop-blur-sm border-2 border-primary/50">
                      <span className="text-6xl font-bold text-primary">{currentToken.symbol.slice(0, 2)}</span>
                    </div>
                  </div>
                )}
                {isFullyFunded && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-green-500 text-white border-0 text-lg px-4 py-2">
                      <CheckCircle2 className="w-5 h-5 mr-2" />
                      Fully Funded!
                    </Badge>
                  </div>
                )}
              </div>
              
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h1 className="text-4xl font-bold">{currentToken.name}</h1>
                      <Badge variant="outline" className="text-lg px-3 py-1">{currentToken.symbol}</Badge>
                    </div>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {currentToken.description || 'No description available'}
                    </p>
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex flex-wrap gap-3 pt-4 border-t">
                  {currentToken.website_url && (
                    <Button variant="outline" asChild className="hover:bg-primary hover:text-primary-foreground transition-colors">
                      <a href={currentToken.website_url} target="_blank" rel="noopener noreferrer">
                        <Globe className="w-4 h-4 mr-2" />
                        Website
                      </a>
                    </Button>
                  )}
                  {currentToken.x_url && (
                    <Button variant="outline" asChild className="hover:bg-primary hover:text-primary-foreground transition-colors">
                      <a href={currentToken.x_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        X/Twitter
                      </a>
                    </Button>
                  )}
                  {currentToken.telegram_url && (
                    <Button variant="outline" asChild className="hover:bg-primary hover:text-primary-foreground transition-colors">
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
              <Card className="hover:border-primary/50 transition-all">
                <CardHeader>
                  <CardTitle className="text-2xl">Meet the Creator</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <Avatar className="w-16 h-16 border-2 border-primary">
                      <AvatarImage src={creatorProfile.avatar_url || ''} />
                      <AvatarFallback className="bg-primary/20 text-primary text-xl">
                        {creatorProfile.display_name?.charAt(0) || creatorProfile.username?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-xl font-bold">{creatorProfile.display_name || 'Anonymous'}</p>
                      <p className="text-muted-foreground">@{creatorProfile.username}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Q&A Section */}
            <Card className="hover:border-primary/50 transition-all">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <MessageCircle className="w-6 h-6" />
                  Questions & Answers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Ask Question Form */}
                <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
                  <h3 className="font-semibold text-lg">Have a question?</h3>
                  <Textarea
                    placeholder="Ask the creator anything about this fund pool..."
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    className="min-h-[120px] text-base"
                    disabled={!user || !isWalletConnected}
                  />
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      {!user || !isWalletConnected ? 'Connect your wallet to ask questions' : 'Be respectful and constructive'}
                    </p>
                    <Button
                      onClick={handleAskQuestion}
                      disabled={!user || !isWalletConnected || isSubmitting || !newQuestion.trim()}
                      className="min-w-[140px]"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      {isSubmitting ? 'Posting...' : 'Ask Question'}
                    </Button>
                  </div>
                </div>

                {/* Questions List */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">{questions.length} Question{questions.length !== 1 ? 's' : ''}</h3>
                  
                  {questions.length === 0 ? (
                    <div className="text-center py-12 bg-muted/20 rounded-lg">
                      <MessageCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground text-lg">No questions yet. Be the first to ask!</p>
                    </div>
                  ) : (
                    questions.map((q) => (
                      <Card key={q.id} className="bg-muted/20 hover:bg-muted/30 transition-colors">
                        <CardContent className="pt-6 space-y-4">
                          {/* Question */}
                          <div className="flex gap-4">
                            <Avatar className="w-10 h-10 border-2 border-border">
                              <AvatarImage src={q.profiles?.avatar_url || ''} />
                              <AvatarFallback className="bg-primary/20 text-primary">
                                {q.profiles?.display_name?.charAt(0) || 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-semibold">
                                  {q.profiles?.display_name || 'Anonymous'}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                  • {getTimeAgo(q.created_at)}
                                </span>
                              </div>
                              <p className="text-foreground text-base leading-relaxed">{q.question}</p>
                            </div>
                          </div>

                          {/* Answer */}
                          {q.answer ? (
                            <div className="ml-14 pl-6 border-l-4 border-primary/40 bg-primary/5 rounded-r-lg p-4">
                              <div className="flex items-center gap-2 mb-3">
                                <Badge className="bg-primary/20 text-primary border-primary/30">
                                  Creator's Answer
                                </Badge>
                                <span className="text-sm text-muted-foreground">
                                  {getTimeAgo(q.answered_at)}
                                </span>
                              </div>
                              <p className="text-foreground text-base leading-relaxed">{q.answer}</p>
                            </div>
                          ) : isCreator ? (
                            <div className="ml-14 space-y-3 p-4 bg-background rounded-lg border-2 border-dashed border-border">
                              <Textarea
                                placeholder="Write your answer..."
                                value={answerText[q.id] || ''}
                                onChange={(e) => setAnswerText(prev => ({ ...prev, [q.id]: e.target.value }))}
                                className="min-h-[100px] text-base"
                              />
                              <Button
                                onClick={() => handleAnswerQuestion(q.id)}
                                disabled={!answerText[q.id]?.trim()}
                                className="w-full sm:w-auto"
                              >
                                Post Answer
                              </Button>
                            </div>
                          ) : (
                            <div className="ml-14 text-muted-foreground italic p-3 bg-muted/20 rounded-lg">
                              Awaiting creator's response...
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Right Side */}
          <div className="lg:col-span-1 space-y-6">
            {/* Funding Progress - Sticky */}
            <div className="sticky top-6 space-y-6">
              {/* Progress Card */}
              <Card className="border-2 border-primary/50">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Target className="w-5 h-5 text-primary" />
                    Funding Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Amounts */}
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Raised</p>
                      <p className="text-3xl font-bold text-primary">{formatFundAmount(currentToken.current_amount)}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Goal</p>
                      <p className="text-xl font-bold">{formatFundAmount(currentToken.goal_amount)}</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <Progress value={progressPercent} className="h-4" />
                    <p className="text-center text-lg font-semibold text-primary">
                      {progressPercent.toFixed(1)}% funded
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 pt-4 border-t">
                    <div className="bg-muted/50 rounded-lg p-3 text-center">
                      <Users2 className="w-5 h-5 text-primary mx-auto mb-1" />
                      <p className="text-2xl font-bold">{formatNumber(backers)}</p>
                      <p className="text-xs text-muted-foreground">Backers</p>
                    </div>
                    <button
                      onClick={handleGiveHeart}
                      disabled={isTogglingHeart}
                      className="bg-muted/50 hover:bg-accent/20 rounded-lg p-3 text-center cursor-pointer transition-all disabled:opacity-50"
                    >
                      <Heart 
                        className={`w-5 h-5 mx-auto mb-1 transition-all ${
                          hasGivenHeart ? 'text-accent fill-accent' : 'text-accent'
                        }`} 
                      />
                      <p className="text-2xl font-bold text-accent">{formatNumber(hearts)}</p>
                      <p className="text-xs text-muted-foreground">
                        {hasGivenHeart ? 'You ❤️' : 'Hearts'}
                      </p>
                    </button>
                  </div>

                  {/* Time */}
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground pt-4 border-t">
                    <Clock className="w-4 h-4" />
                    Launched {getTimeAgo(currentToken.created_at)}
                  </div>

                  {/* CTA Button */}
                  <Button 
                    className="w-full h-12 text-lg"
                    disabled={!isWalletConnected}
                    onClick={() => {
                      if (!isWalletConnected) {
                        navigate('/connect-wallet');
                      } else {
                        toast({
                          title: "Coming Soon",
                          description: "Donation functionality will be available soon!",
                        });
                      }
                    }}
                  >
                    {isWalletConnected ? 'Support This Pool' : 'Connect Wallet to Support'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenDetail;
