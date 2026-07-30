import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, CheckCircle2, AlertTriangle, Zap } from 'lucide-react';

interface AuditResult {
  category: string;
  score: number;
  findings: string[];
  recommendations: string[];
  severity: 'critical' | 'warning' | 'info';
}

const auditCategories = [
  'SEO',
  'Accessibility',
  'Speed',
  'Mobile',
  'UX',
  'Branding',
  'Content',
  'CTA',
  'Local SEO',
  'Technical SEO',
  'Compliance',
  'AI Readiness',
];

const defaultAuditResults: AuditResult[] = [
  {
    category: 'SEO',
    score: 78,
    findings: [
      'Meta descriptions missing on 15 pages',
      'H1 tags properly implemented on 95% of pages',
      'Mobile-friendly design detected',
    ],
    recommendations: [
      'Add unique meta descriptions to all pages',
      'Increase internal linking strategy',
      'Optimize for featured snippets',
    ],
    severity: 'warning',
  },
  {
    category: 'Accessibility',
    score: 85,
    findings: [
      'WCAG 2.1 AA compliance at 85%',
      'Alt text present on 90% of images',
      'Keyboard navigation working properly',
    ],
    recommendations: [
      'Add alt text to remaining images',
      'Improve color contrast on 3 elements',
      'Add ARIA labels to form fields',
    ],
    severity: 'info',
  },
  {
    category: 'Speed',
    score: 72,
    findings: [
      'Page load time: 2.8 seconds',
      'Largest Contentful Paint: 1.9s',
      'Cumulative Layout Shift: 0.08',
    ],
    recommendations: [
      'Optimize images (could save 200KB)',
      'Enable GZIP compression',
      'Reduce JavaScript bundle size',
    ],
    severity: 'warning',
  },
  {
    category: 'Mobile',
    score: 92,
    findings: [
      'Mobile-first design implemented',
      'Touch targets properly sized',
      'Responsive layout working on all devices',
    ],
    recommendations: [
      'Test on additional device sizes',
      'Optimize mobile form inputs',
    ],
    severity: 'info',
  },
  {
    category: 'Compliance',
    score: 88,
    findings: [
      'HIPAA compliance indicators present',
      'Privacy policy accessible',
      'No patient data exposed in URLs',
    ],
    recommendations: [
      'Add HIPAA business associate agreement link',
      'Implement additional security headers',
    ],
    severity: 'info',
  },
];

export default function WebsiteAudit() {
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [auditResults, setAuditResults] = useState<AuditResult[]>([]);
  const [isAuditing, setIsAuditing] = useState(false);
  const [hasAudited, setHasAudited] = useState(false);

  const handleRunAudit = () => {
    if (!websiteUrl.trim()) return;

    setIsAuditing(true);
    // Simulate API call
    setTimeout(() => {
      setAuditResults(defaultAuditResults);
      setHasAudited(true);
      setIsAuditing(false);
    }, 2000);
  };

  const overallScore = auditResults.length > 0
    ? Math.round(auditResults.reduce((sum, r) => sum + r.score, 0) / auditResults.length)
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

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="flex h-full flex-col space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Website Audit</h1>
        <p className="text-muted-foreground">
          Comprehensive audit of your healthcare website across multiple dimensions.
        </p>
      </div>

      {/* Audit Input */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Run Website Audit</CardTitle>
          <CardDescription>
            Enter your website URL to analyze SEO, accessibility, performance, compliance, and more.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="https://example.com"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleRunAudit()}
            />
            <Button
              onClick={handleRunAudit}
              disabled={!websiteUrl.trim() || isAuditing}
            >
              {isAuditing ? 'Auditing...' : 'Run Audit'}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            This audit will analyze your website and provide recommendations for improvement.
          </p>
        </CardContent>
      </Card>

      {/* Results */}
      {hasAudited && (
        <div className="space-y-6">
          {/* Overall Score */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Overall Score</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className={`text-5xl font-bold ${getScoreColor(overallScore)}`}>
                    {overallScore}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">/100</p>
                </div>
                <div className="flex-1 ml-8">
                  <Progress value={overallScore} className="h-3" />
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>Poor</span>
                    <span>Fair</span>
                    <span>Good</span>
                    <span>Excellent</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Category Scores */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Category Breakdown</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {auditResults.map((result) => (
                <Card key={result.category}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm">{result.category}</CardTitle>
                      <div className={`text-lg font-bold ${getScoreColor(result.score)}`}>
                        {result.score}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Progress value={result.score} className="h-2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Detailed Findings */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Detailed Findings</h2>
            <Tabs defaultValue={auditResults[0]?.category} className="w-full">
              <TabsList className="grid w-full grid-cols-6 lg:grid-cols-12">
                {auditResults.map((result) => (
                  <TabsTrigger key={result.category} value={result.category} className="text-xs">
                    {result.category}
                  </TabsTrigger>
                ))}
              </TabsList>

              {auditResults.map((result) => (
                <TabsContent key={result.category} value={result.category} className="space-y-4 mt-4">
                  <div className={`border rounded-lg p-4 ${getSeverityColor(result.severity)}`}>
                    <div className="flex gap-3">
                      {getSeverityIcon(result.severity)}
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm mb-2">{result.category} Audit Results</h3>
                        <div className="space-y-2">
                          <div>
                            <p className="text-xs font-semibold text-muted-foreground mb-1">Findings:</p>
                            <ul className="text-sm space-y-1">
                              {result.findings.map((finding, idx) => (
                                <li key={idx} className="flex gap-2">
                                  <span className="text-green-600">✓</span>
                                  <span>{finding}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="pt-3 border-t">
                            <p className="text-xs font-semibold text-muted-foreground mb-1">Recommendations:</p>
                            <ul className="text-sm space-y-1">
                              {result.recommendations.map((rec, idx) => (
                                <li key={idx} className="flex gap-2">
                                  <span className="text-blue-600">→</span>
                                  <span>{rec}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>

          {/* Export Options */}
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1">
              Download PDF Report
            </Button>
            <Button variant="outline" className="flex-1">
              Share Results
            </Button>
            <Button className="flex-1">
              Schedule Follow-up Audit
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
