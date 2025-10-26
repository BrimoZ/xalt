import Navbar from "@/components/Navbar";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ExternalLink, Globe, Send, Heart, Users2, Target, Clock, MessageCircle } from "lucide-react";
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

  // Load token, creator data, hearts, and backers
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
      
      // Load creator profile
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
      // Get total hearts count
      const { count: heartCount } = await supabase
        .from('token_hearts')
        .select('*', { count: 'exact', head: true })
        .eq('token_id', tokenId);

      setHearts(heartCount || 0);

      // Check if current user has given a heart
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
      // Get unique backer count
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
        // Remove heart
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
        // Add heart
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

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
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
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {/* Token Header */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Token Info Card */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-start gap-6">
                {currentToken.image_url && (
                  <img
                    src={currentToken.image_url}
                    alt={currentToken.name}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <CardTitle className="text-3xl">{currentToken.name}</CardTitle>
                    <Badge>{currentToken.symbol}</Badge>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    {currentToken.description || 'No description available'}
                  </p>
                  
                  {/* Social Links */}
                  <div className="flex gap-3">
                    {currentToken.website_url && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={currentToken.website_url} target="_blank" rel="noopener noreferrer">
                          <Globe className="w-4 h-4 mr-2" />
                          Website
                        </a>
                      </Button>
                    )}
                    {currentToken.x_url && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={currentToken.x_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          X
                        </a>
                      </Button>
                    )}
                    {currentToken.telegram_url && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={currentToken.telegram_url} target="_blank" rel="noopener noreferrer">
                          <Send className="w-4 h-4 mr-2" />
                          Telegram
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Funding Progress Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Funding Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Amounts */}
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Raised</p>
                <p className="text-3xl font-bold text-primary mb-4">{formatFundAmount(currentToken.current_amount)}</p>
                
                <p className="text-sm text-muted-foreground mb-1">Goal</p>
                <p className="text-xl font-bold mb-4">{formatFundAmount(currentToken.goal_amount)}</p>
              </div>

              {/* Progress Bar */}
              <div>
                <Progress value={progressPercent} className="h-3 mb-2" />
                <p className="text-sm text-muted-foreground text-center">{progressPercent.toFixed(1)}% funded</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-card/50 border border-border rounded-lg p-3 text-center">
                  <Users2 className="w-4 h-4 text-primary mx-auto mb-1" />
                  <p className="text-xl font-bold text-foreground">{formatNumber(backers)}</p>
                  <p className="text-xs text-muted-foreground">Backers</p>
                </div>
                <button
                  onClick={handleGiveHeart}
                  disabled={isTogglingHeart}
                  className="bg-card/50 border border-border rounded-lg p-3 text-center cursor-pointer hover:border-accent/50 transition-all disabled:opacity-50"
                >
                  <Heart 
                    className={`w-4 h-4 mx-auto mb-1 transition-all ${
                      hasGivenHeart ? 'text-accent fill-accent' : 'text-accent'
                    }`} 
                  />
                  <p className="text-xl font-bold text-accent">{formatNumber(hearts)}</p>
                  <p className="text-xs text-muted-foreground">
                    {hasGivenHeart ? 'You ❤️' : 'Hearts'}
                  </p>
                </button>
              </div>

              {/* Time */}
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                Launched {getTimeAgo(currentToken.created_at)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Creator Info */}
        {creatorProfile && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Created By</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={creatorProfile.avatar_url || ''} />
                  <AvatarFallback>
                    {creatorProfile.display_name?.charAt(0) || creatorProfile.username?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{creatorProfile.display_name || 'Anonymous'}</p>
                  <p className="text-sm text-muted-foreground">@{creatorProfile.username}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Q&A Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Questions & Answers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Ask Question Form */}
            <div className="space-y-3">
              <h3 className="font-semibold">Ask the Fund Creator</h3>
              <Textarea
                placeholder="What would you like to know about this fund pool?"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                className="min-h-[100px]"
                disabled={!user || !isWalletConnected}
              />
              <Button
                onClick={handleAskQuestion}
                disabled={!user || !isWalletConnected || isSubmitting || !newQuestion.trim()}
                className="w-full sm:w-auto"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                {isSubmitting ? 'Posting...' : 'Ask Question'}
              </Button>
              {(!user || !isWalletConnected) && (
                <p className="text-sm text-muted-foreground">
                  Connect your wallet to ask questions
                </p>
              )}
            </div>

            {/* Questions List */}
            <div className="space-y-4">
              {questions.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No questions yet. Be the first to ask!
                </p>
              ) : (
                questions.map((q) => (
                  <Card key={q.id} className="bg-muted/30">
                    <CardContent className="pt-6 space-y-4">
                      {/* Question */}
                      <div className="flex gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={q.profiles?.avatar_url || ''} />
                          <AvatarFallback>
                            {q.profiles?.display_name?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">
                              {q.profiles?.display_name || 'Anonymous'}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(q.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-foreground">{q.question}</p>
                        </div>
                      </div>

                      {/* Answer */}
                      {q.answer ? (
                        <div className="ml-11 pl-4 border-l-2 border-primary/30">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="text-xs">
                              Creator's Answer
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {new Date(q.answered_at).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-foreground">{q.answer}</p>
                        </div>
                      ) : isCreator ? (
                        <div className="ml-11 space-y-2">
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
                        <div className="ml-11 text-sm text-muted-foreground">
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

        {/* Donation Notice */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-lg mb-4">
                {isWalletConnected 
                  ? 'Donation functionality coming soon!'
                  : 'Connect your wallet to support this fund pool'
                }
              </p>
              {!isWalletConnected && (
                <Button onClick={() => navigate('/connect-wallet')}>
                  Connect Wallet
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TokenDetail;