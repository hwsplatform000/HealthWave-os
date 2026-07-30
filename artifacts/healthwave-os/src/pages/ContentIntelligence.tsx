import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, CheckCircle2, AlertTriangle, Zap, TrendingUp, Eye } from 'lucide-react';

interface ContentSuggestion {
  category: string;
  score: number;
  suggestion: string;
  severity: 'info' | 'warning' | 'critical';
  actionable: boolean;
}

const defaultSuggestions: ContentSuggestion[] = [
  {
    category: 'Readability',
    score: 78,
    suggestion: 'Consider breaking up long paragraphs. Average paragraph length is 120 words, recommended is 50-75.',
    severity: 'info',
    actionable: true,
  },
  {
    category: 'Engagement',
    score: 85,
    suggestion: 'Strong use of questions and calls-to-action. Good engagement potential.',
    severity: 'info',
    actionable: false,
  },
  {
    category: 'CTA Strength',
    score: 72,
    suggestion: 'Add more specific action words. Replace "Learn more" with "Get your free guide" or similar.',
    severity: 'warning',
    actionable: true,
  },
  {
    category: 'Medical Terminology',
    score: 88,
    suggestion: 'Good balance of medical and layman terms. Accessible to general audience.',
    severity: 'info',
    actionable: false,
  },
  {
    category: 'SEO Optimization',
    score: 65,
    suggestion: 'Add more relevant keywords. Consider including "preventive care" and "wellness tips".',
    severity: 'warning',
    actionable: true,
  },
  {
    category: 'Compliance',
    score: 92,
    suggestion: 'No medical claims detected. Content appears compliant with healthcare regulations.',
    severity: 'info',
    actionable: false,
  },
  {
    category: 'Platform Optimization',
    score: 70,
    suggestion: 'Add emojis and line breaks for better mobile readability on social platforms.',
    severity: 'warning',
    actionable: true,
  },
  {
    category: 'Accessibility',
    score: 80,
    suggestion: 'Consider adding alt text for any images and using descriptive headers.',
    severity: 'info',
    actionable: true,
  },
];

export default function ContentIntelligence() {
  const [content, setContent] = useState('');
  const [suggestions, setSuggestions] = useState<ContentSuggestion[]>([]);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyzeContent = () => {
    if (!content.trim()) return;

    setIsAnalyzing(true);
    // Simulate API call
    setTimeout(() => {
      setSuggestions(defaultSuggestions);
      setHasAnalyzed(true);
      setIsAnalyzing(false);
    }, 1500);
  };

  const averageScore = suggestions.length > 0
    ? Math.round(suggestions.reduce((sum, s) => sum + s.score, 0) / suggestions.length)
    : 0;

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default:
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-destructive/10 border-destructive/20';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-green-50 border-green-200';
    }
  };

  return (
    <div className="flex h-full flex-col space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Content Intelligence</h1>
        <p className="text-muted-foreground">
          Analyze your content for readability, engagement, compliance, and optimization opportunities.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Content Input */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Analyze Your Content</CardTitle>
              <CardDescription>
                Paste or type your content to get AI-powered suggestions for improvement.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Paste your social post, blog article, email, or any healthcare content here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={8}
                className="resize-none"
              />
              <Button
                onClick={handleAnalyzeContent}
                disabled={!content.trim() || isAnalyzing}
                className="w-full"
              >
                {isAnalyzing ? 'Analyzing...' : 'Analyze Content'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Score Card */}
        {hasAnalyzed && (
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="text-base">Overall Score</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col items-center justify-center space-y-4">
              <div className="text-center">
                <div className="text-5xl font-bold text-primary">{averageScore}</div>
                <p className="text-sm text-muted-foreground mt-1">/100</p>
              </div>
              <div className="w-full space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Content Quality</span>
                  <span className="font-semibold">{Math.round(suggestions.filter(s => s.severity === 'info').length / suggestions.length * 100)}%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${Math.round(suggestions.filter(s => s.severity === 'info').length / suggestions.length * 100)}%` }}
                  />
                </div>
              </div>
              <Button variant="outline" className="w-full" size="sm">
                View Detailed Report
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Suggestions */}
      {hasAnalyzed && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Suggestions & Recommendations</h2>
            <Badge variant="outline">{suggestions.length} items</Badge>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="actionable">Actionable</TabsTrigger>
              <TabsTrigger value="warnings">Warnings</TabsTrigger>
              <TabsTrigger value="compliant">Compliant</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-3 mt-4">
              {suggestions.map((suggestion, idx) => (
                <Alert key={idx} className={`border ${getSeverityColor(suggestion.severity)}`}>
                  <div className="flex gap-3">
                    {getSeverityIcon(suggestion.severity)}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-sm">{suggestion.category}</h4>
                        <div className="flex items-center gap-2">
                          <div className="text-xs font-medium">{suggestion.score}/100</div>
                          {suggestion.actionable && (
                            <Badge variant="secondary" className="text-xs">Actionable</Badge>
                          )}
                        </div>
                      </div>
                      <AlertDescription className="text-sm">
                        {suggestion.suggestion}
                      </AlertDescription>
                    </div>
                  </div>
                </Alert>
              ))}
            </TabsContent>

            <TabsContent value="actionable" className="space-y-3 mt-4">
              {suggestions
                .filter(s => s.actionable)
                .map((suggestion, idx) => (
                  <Alert key={idx} className={`border ${getSeverityColor(suggestion.severity)}`}>
                    <div className="flex gap-3">
                      {getSeverityIcon(suggestion.severity)}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-sm">{suggestion.category}</h4>
                          <div className="text-xs font-medium">{suggestion.score}/100</div>
                        </div>
                        <AlertDescription className="text-sm">
                          {suggestion.suggestion}
                        </AlertDescription>
                      </div>
                    </div>
                  </Alert>
                ))}
            </TabsContent>

            <TabsContent value="warnings" className="space-y-3 mt-4">
              {suggestions
                .filter(s => s.severity === 'warning')
                .map((suggestion, idx) => (
                  <Alert key={idx} className={`border ${getSeverityColor(suggestion.severity)}`}>
                    <div className="flex gap-3">
                      {getSeverityIcon(suggestion.severity)}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-sm">{suggestion.category}</h4>
                          <div className="text-xs font-medium">{suggestion.score}/100</div>
                        </div>
                        <AlertDescription className="text-sm">
                          {suggestion.suggestion}
                        </AlertDescription>
                      </div>
                    </div>
                  </Alert>
                ))}
            </TabsContent>

            <TabsContent value="compliant" className="space-y-3 mt-4">
              {suggestions
                .filter(s => s.severity === 'info')
                .map((suggestion, idx) => (
                  <Alert key={idx} className={`border ${getSeverityColor(suggestion.severity)}`}>
                    <div className="flex gap-3">
                      {getSeverityIcon(suggestion.severity)}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-sm">{suggestion.category}</h4>
                          <div className="text-xs font-medium">{suggestion.score}/100</div>
                        </div>
                        <AlertDescription className="text-sm">
                          {suggestion.suggestion}
                        </AlertDescription>
                      </div>
                    </div>
                  </Alert>
                ))}
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
