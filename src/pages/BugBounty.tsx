import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Bug, Shield, Zap, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const BugBounty = () => {
  const { user, isXConnected } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    severity: "medium",
    stepsToReproduce: "",
    expectedBehavior: "",
    actualBehavior: "",
    url: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !isXConnected) {
      toast({
        title: "Authentication Required",
        description: "Please connect with X to submit bug reports.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.title || !formData.description || !formData.category) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Get browser info
      const browserInfo = `${navigator.userAgent} | Screen: ${screen.width}x${screen.height} | Platform: ${navigator.platform}`;
      
      const { error } = await supabase
        .from('bug_reports')
        .insert({
          user_id: user.id,
          title: formData.title,
          description: formData.description,
          category: formData.category,
          severity: formData.severity,
          steps_to_reproduce: formData.stepsToReproduce,
          expected_behavior: formData.expectedBehavior,
          actual_behavior: formData.actualBehavior,
          url: formData.url || window.location.href,
          browser_info: browserInfo
        });

      if (error) {
        console.error('Error submitting bug report:', error);
        toast({
          title: "Submission Failed",
          description: "Failed to submit bug report. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Bug Report Submitted! 🐛",
        description: "Thank you for helping us improve the platform. We'll review your report soon.",
      });

      // Reset form
      setFormData({
        title: "",
        description: "",
        category: "",
        severity: "medium",
        stepsToReproduce: "",
        expectedBehavior: "",
        actualBehavior: "",
        url: "",
      });

    } catch (error) {
      console.error('Error submitting bug report:', error);
      toast({
        title: "Submission Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Bug className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">Bug Bounty Program</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Help us build a better platform! Report bugs, suggest improvements, and earn rewards for making Xalt more reliable for everyone.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Bug Report Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Shield className="w-5 h-5 text-primary" />
                  Submit Bug Report
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Title */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Bug Title *
                    </label>
                    <Input
                      placeholder="Brief description of the issue"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      required
                    />
                  </div>

                  {/* Category & Severity */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Category *
                      </label>
                      <Select onValueChange={(value) => handleInputChange('category', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ui">UI/UX Issue</SelectItem>
                          <SelectItem value="functionality">Functionality</SelectItem>
                          <SelectItem value="performance">Performance</SelectItem>
                          <SelectItem value="security">Security</SelectItem>
                          <SelectItem value="trading">Trading</SelectItem>
                          <SelectItem value="authentication">Authentication</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Severity
                      </label>
                      <Select value={formData.severity} onValueChange={(value) => handleInputChange('severity', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Description *
                    </label>
                    <Textarea
                      placeholder="Detailed description of the bug"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={4}
                      required
                    />
                  </div>

                  {/* Steps to Reproduce */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Steps to Reproduce
                    </label>
                    <Textarea
                      placeholder="1. Go to...&#10;2. Click on...&#10;3. Expected vs actual result"
                      value={formData.stepsToReproduce}
                      onChange={(e) => handleInputChange('stepsToReproduce', e.target.value)}
                      rows={3}
                    />
                  </div>

                  {/* Expected vs Actual Behavior */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Expected Behavior
                      </label>
                      <Textarea
                        placeholder="What should happen"
                        value={formData.expectedBehavior}
                        onChange={(e) => handleInputChange('expectedBehavior', e.target.value)}
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Actual Behavior
                      </label>
                      <Textarea
                        placeholder="What actually happens"
                        value={formData.actualBehavior}
                        onChange={(e) => handleInputChange('actualBehavior', e.target.value)}
                        rows={3}
                      />
                    </div>
                  </div>

                  {/* URL */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Page URL (optional)
                    </label>
                    <Input
                      placeholder="Where did you encounter this bug?"
                      value={formData.url}
                      onChange={(e) => handleInputChange('url', e.target.value)}
                    />
                  </div>

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    className="w-full h-12 text-lg font-semibold"
                    disabled={isSubmitting || !user || !isXConnected}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Bug className="w-5 h-5 mr-2" />
                        Submit Bug Report
                      </>
                    )}
                  </Button>

                  {(!user || !isXConnected) && (
                    <p className="text-center text-sm text-muted-foreground">
                      Please connect with X to submit bug reports
                    </p>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            {/* Bounty Rewards */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  Bounty Rewards
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <div>
                    <div className="font-semibold text-red-500">Critical</div>
                    <div className="text-sm text-muted-foreground">$500 - $2000</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
                  <AlertTriangle className="w-5 h-5 text-orange-500" />
                  <div>
                    <div className="font-semibold text-orange-500">High</div>
                    <div className="text-sm text-muted-foreground">$100 - $500</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
                  <div>
                    <div className="font-semibold text-yellow-500">Medium</div>
                    <div className="text-sm text-muted-foreground">$25 - $100</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <div>
                    <div className="font-semibold text-green-500">Low</div>
                    <div className="text-sm text-muted-foreground">$5 - $25</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Guidelines */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Provide clear reproduction steps</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Include screenshots if possible</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Test on multiple browsers/devices</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Report responsibly - no public disclosure</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>One issue per report</span>
                </div>
              </CardContent>
            </Card>

            {/* Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Process Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Initial Review</span>
                  <Badge variant="secondary">24-48h</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Verification</span>
                  <Badge variant="secondary">3-7 days</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Bounty Payment</span>
                  <Badge variant="secondary">7-14 days</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BugBounty;