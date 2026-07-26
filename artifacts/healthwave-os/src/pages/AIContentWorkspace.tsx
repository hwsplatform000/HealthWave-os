import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sparkles, Copy, Save, RefreshCw, Zap } from 'lucide-react';

type ContentType = 'social_post' | 'blog' | 'email' | 'video_script' | 'carousel' | 'landing_page' | 'ad_copy' | 'patient_education' | 'faq' | 'custom';

interface AIContentRequest {
  type: ContentType;
  topic: string;
  brandVoice?: string;
  specialty?: string;
  platform?: string;
  additionalContext?: string;
}

interface GeneratedContent {
  id: string;
  type: ContentType;
  content: string;
  generatedAt: string;
  isEdited: boolean;
}

const contentTypeConfig: Record<ContentType, { label: string; description: string; placeholder: string }> = {
  social_post: { label: 'Social Post', description: 'Short-form social media content', placeholder: 'E.g., Mental health awareness tips for Instagram' },
  blog: { label: 'Blog Article', description: 'Long-form blog content', placeholder: 'E.g., Complete guide to managing anxiety' },
  email: { label: 'Email Campaign', description: 'Email marketing content', placeholder: 'E.g., Patient newsletter about preventive care' },
  video_script: { label: 'Video Script', description: 'Script for video content', placeholder: 'E.g., 60-second TikTok about dental health' },
  carousel: { label: 'Carousel Post', description: 'Multi-slide carousel content', placeholder: 'E.g., 5-slide carousel on stress management' },
  landing_page: { label: 'Landing Page', description: 'Website landing page copy', placeholder: 'E.g., New patient onboarding page' },
  ad_copy: { label: 'Ad Copy', description: 'Advertising copy', placeholder: 'E.g., Facebook ad for new service' },
  patient_education: { label: 'Patient Education', description: 'Educational content for patients', placeholder: 'E.g., Post-surgery care instructions' },
  faq: { label: 'FAQ', description: 'Frequently asked questions', placeholder: 'E.g., Common questions about our services' },
  custom: { label: 'Custom', description: 'Custom content type', placeholder: 'Describe what you need...' },
};

export default function AIContentWorkspace() {
  const [selectedType, setSelectedType] = useState<ContentType>('social_post');
  const [request, setRequest] = useState<AIContentRequest>({
    type: 'social_post',
    topic: '',
    brandVoice: '',
    specialty: '',
    platform: '',
    additionalContext: '',
  });
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [editedContent, setEditedContent] = useState('');

  const config = contentTypeConfig[selectedType];

  const handleGenerate = async () => {
    if (!request.topic) return;

    setIsGenerating(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockContent = generateMockContent(selectedType, request);
      setGeneratedContent({
        id: `content-${Date.now()}`,
        type: selectedType,
        content: mockContent,
        generatedAt: new Date().toISOString(),
        isEdited: false,
      });
      setEditedContent(mockContent);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerate = async () => {
    await handleGenerate();
  };

  const handleCopyContent = () => {
    if (editedContent) {
      navigator.clipboard.writeText(editedContent);
    }
  };

  const handleSaveAsDraft = () => {
    if (generatedContent && editedContent) {
      // Save to drafts
      console.log('Saving as draft:', editedContent);
    }
  };

  return (
    <div className="flex h-full flex-col space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Sparkles className="h-8 w-8 text-primary" />
          AI Content Workspace
        </h1>
        <p className="text-muted-foreground mt-1">
          Generate fully editable content across multiple formats using AI.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 flex-1 min-h-0">
        {/* Left Panel - Content Type Selection & Input */}
        <div className="lg:col-span-1 flex flex-col space-y-4">
          <Card className="flex-1 flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Content Type</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col space-y-3">
              <Tabs value={selectedType} onValueChange={(val) => {
                setSelectedType(val as ContentType);
                setRequest({ ...request, type: val as ContentType });
              }} className="flex flex-col flex-1">
                <TabsList className="grid grid-cols-2 w-full">
                  {Object.entries(contentTypeConfig).slice(0, 4).map(([key]) => (
                    <TabsTrigger key={key} value={key} className="text-xs">
                      {contentTypeConfig[key as ContentType].label}
                    </TabsTrigger>
                  ))}
                </TabsList>
                <TabsList className="grid grid-cols-2 w-full mt-2">
                  {Object.entries(contentTypeConfig).slice(4, 8).map(([key]) => (
                    <TabsTrigger key={key} value={key} className="text-xs">
                      {contentTypeConfig[key as ContentType].label}
                    </TabsTrigger>
                  ))}
                </TabsList>
                <div className="mt-2">
                  <TabsTrigger value="custom" className="w-full text-xs">
                    {contentTypeConfig.custom.label}
                  </TabsTrigger>
                </div>
              </Tabs>

              <div className="p-2 rounded-lg bg-primary/5 border border-primary/20">
                <p className="text-xs text-muted-foreground">
                  <strong>{config.label}</strong>: {config.description}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="flex-1 flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Generation Settings</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col space-y-3 overflow-y-auto">
              <div>
                <Label htmlFor="topic" className="text-xs">Topic / Main Idea</Label>
                <Textarea
                  id="topic"
                  placeholder={config.placeholder}
                  value={request.topic}
                  onChange={(e) => setRequest({ ...request, topic: e.target.value })}
                  rows={3}
                  className="mt-1 text-sm"
                />
              </div>

              <div>
                <Label htmlFor="brandVoice" className="text-xs">Brand Voice</Label>
                <Select value={request.brandVoice || ''} onValueChange={(val) => setRequest({ ...request, brandVoice: val })}>
                  <SelectTrigger id="brandVoice" className="mt-1 text-sm">
                    <SelectValue placeholder="Select brand voice" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    <SelectItem value="professional">HealthWave Professional</SelectItem>
                    <SelectItem value="mental-health">Mental Health Support</SelectItem>
                    <SelectItem value="dental">Dental Friendly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="specialty" className="text-xs">Healthcare Specialty</Label>
                <Select value={request.specialty || ''} onValueChange={(val) => setRequest({ ...request, specialty: val })}>
                  <SelectTrigger id="specialty" className="mt-1 text-sm">
                    <SelectValue placeholder="Select specialty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">General</SelectItem>
                    <SelectItem value="mental-health">Mental Health</SelectItem>
                    <SelectItem value="dentistry">Dentistry</SelectItem>
                    <SelectItem value="cardiology">Cardiology</SelectItem>
                    <SelectItem value="dermatology">Dermatology</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selectedType === 'social_post' && (
                <div>
                  <Label htmlFor="platform" className="text-xs">Platform</Label>
                  <Select value={request.platform || ''} onValueChange={(val) => setRequest({ ...request, platform: val })}>
                    <SelectTrigger id="platform" className="mt-1 text-sm">
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="tiktok">TikTok</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <Label htmlFor="context" className="text-xs">Additional Context</Label>
                <Textarea
                  id="context"
                  placeholder="Any additional details..."
                  value={request.additionalContext || ''}
                  onChange={(e) => setRequest({ ...request, additionalContext: e.target.value })}
                  rows={2}
                  className="mt-1 text-sm"
                />
              </div>

              <Button onClick={handleGenerate} disabled={!request.topic || isGenerating} className="w-full gap-2 mt-auto">
                <Zap className="h-4 w-4" />
                {isGenerating ? 'Generating...' : 'Generate Content'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Generated Content */}
        <div className="lg:col-span-2 flex flex-col space-y-4">
          {generatedContent ? (
            <>
              <Card className="flex-1 flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">Generated Content</CardTitle>
                      <CardDescription className="text-xs mt-1">
                        {generatedContent.isEdited ? 'Edited' : 'Generated'} • {new Date(generatedContent.generatedAt).toLocaleTimeString()}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={handleRegenerate} className="gap-1">
                        <RefreshCw className="h-4 w-4" />
                        Regenerate
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col overflow-hidden">
                  <Textarea
                    value={editedContent}
                    onChange={(e) => {
                      setEditedContent(e.target.value);
                      if (generatedContent) {
                        setGeneratedContent({ ...generatedContent, isEdited: true });
                      }
                    }}
                    className="flex-1 resize-none font-mono text-sm"
                  />
                </CardContent>
              </Card>

              <div className="flex gap-2">
                <Button onClick={handleCopyContent} variant="outline" className="flex-1 gap-2">
                  <Copy className="h-4 w-4" />
                  Copy to Clipboard
                </Button>
                <Button onClick={handleSaveAsDraft} className="flex-1 gap-2">
                  <Save className="h-4 w-4" />
                  Save as Draft
                </Button>
              </div>
            </>
          ) : (
            <Card className="flex-1 flex items-center justify-center border-dashed">
              <CardContent className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
                <Sparkles className="h-12 w-12 mb-4 opacity-20" />
                <h3 className="text-lg font-medium text-foreground">Ready to Generate</h3>
                <p className="mt-2 max-w-sm text-sm">
                  Fill in your content details and click "Generate Content" to create AI-powered content.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function generateMockContent(type: ContentType, request: AIContentRequest): string {
  const templates: Record<ContentType, string> = {
    social_post: `🌟 ${request.topic}

Discover the power of ${request.topic.toLowerCase()}. Our latest research shows that patients who [key benefit] experience [positive outcome].

Key takeaways:
✓ [Point 1]
✓ [Point 2]
✓ [Point 3]

Ready to learn more? Link in bio.

#${request.specialty || 'healthcare'} #wellness`,

    blog: `# ${request.topic}

## Introduction
${request.topic} is an important topic in healthcare that affects millions of people. In this comprehensive guide, we'll explore everything you need to know.

## Key Points
1. **Understanding the Basics**: [Content about fundamentals]
2. **Why It Matters**: [Relevance and importance]
3. **Practical Solutions**: [Actionable advice]
4. **Expert Recommendations**: [Professional guidance]

## Conclusion
By implementing these strategies, you can [positive outcome].

---
*This article is for informational purposes only and should not replace professional medical advice.*`,

    email: `Subject: Discover How to ${request.topic}

Hi there,

We hope you're having a great week! We wanted to share something special with you today.

${request.topic} is something many of our patients ask about, and we've put together some valuable insights.

**Here's what you'll learn:**
• [Benefit 1]
• [Benefit 2]
• [Benefit 3]

[Call to Action Button]

Best regards,
The Team`,

    video_script: `[INTRO - 0-5 seconds]
"Did you know? ${request.topic}..."

[HOOK - 5-15 seconds]
"Most people don't realize that..."

[CONTENT - 15-50 seconds]
"Here are the key things you need to know:
1. [Point 1]
2. [Point 2]
3. [Point 3]"

[CTA - 50-60 seconds]
"Ready to learn more? Check the link in bio!"`,

    carousel: `Slide 1: ${request.topic}
Slide 2: Why This Matters
Slide 3: Key Benefit #1
Slide 4: Key Benefit #2
Slide 5: Key Benefit #3
Slide 6: Call to Action`,

    landing_page: `# ${request.topic}

## Transform Your Health Today

${request.topic} is the solution you've been looking for.

### Why Choose Us?
- Expert care
- Personalized approach
- Proven results

[Schedule Your Consultation]

### What Our Patients Say
"This has changed my life..." - Patient testimonial`,

    ad_copy: `${request.topic}

Limited time offer! Discover how [benefit] can [positive outcome].

✓ [Feature 1]
✓ [Feature 2]
✓ [Feature 3]

[Learn More]`,

    patient_education: `# Understanding ${request.topic}

## What You Need to Know

${request.topic} is an important aspect of your health. Here's what you should know:

### Before
- [Preparation step 1]
- [Preparation step 2]

### During
- [What to expect]

### After
- [Recovery tips]
- [Follow-up care]

Contact us if you have any questions.`,

    faq: `**Q: What is ${request.topic}?**
A: [Clear explanation]

**Q: How does it work?**
A: [Process explanation]

**Q: Is it safe?**
A: [Safety information]

**Q: What should I expect?**
A: [Expectations]`,

    custom: `Generated content for: ${request.topic}\n\nBrand Voice: ${request.brandVoice || 'Default'}\nSpecialty: ${request.specialty || 'General'}\n\n[Your custom content here]`,
  };

  return templates[type] || templates.custom;
}
