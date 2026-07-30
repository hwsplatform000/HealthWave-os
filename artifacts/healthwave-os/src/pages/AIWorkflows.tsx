import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, Play, Copy, Trash2, Plus, Zap } from 'lucide-react';

interface Workflow {
  id: string;
  name: string;
  description: string;
  type: 'calendar' | 'campaign' | 'repurpose' | 'email_sequence' | 'faq' | 'video_script' | 'research_summary' | 'competitor_analysis' | 'website_review' | 'seo_optimization' | 'custom';
  steps: number;
  isFavorite: boolean;
  isTemplate: boolean;
  tags: string[];
  usageCount: number;
}

const defaultWorkflows: Workflow[] = [
  {
    id: 'wf1',
    name: 'Create Monthly Content Calendar',
    description: 'Generate a full month of content ideas based on trends, specialties, and content pillars',
    type: 'calendar',
    steps: 5,
    isFavorite: true,
    isTemplate: true,
    tags: ['calendar', 'planning', 'monthly'],
    usageCount: 12,
  },
  {
    id: 'wf2',
    name: 'Generate Social Campaign',
    description: 'Create a complete social media campaign with posts, hashtags, and engagement strategy',
    type: 'campaign',
    steps: 4,
    isFavorite: true,
    isTemplate: true,
    tags: ['social', 'campaign', 'engagement'],
    usageCount: 8,
  },
  {
    id: 'wf3',
    name: 'Repurpose Blog to Social',
    description: 'Transform a blog article into multiple social media posts optimized for each platform',
    type: 'repurpose',
    steps: 3,
    isFavorite: false,
    isTemplate: true,
    tags: ['repurpose', 'social', 'blog'],
    usageCount: 15,
  },
  {
    id: 'wf4',
    name: 'Email Sequence Builder',
    description: 'Create a multi-part email sequence for patient education or promotion',
    type: 'email_sequence',
    steps: 6,
    isFavorite: true,
    isTemplate: true,
    tags: ['email', 'sequence', 'nurture'],
    usageCount: 5,
  },
  {
    id: 'wf5',
    name: 'FAQ Generator',
    description: 'Generate comprehensive FAQ content based on common patient questions',
    type: 'faq',
    steps: 3,
    isFavorite: false,
    isTemplate: true,
    tags: ['faq', 'education', 'patient'],
    usageCount: 7,
  },
  {
    id: 'wf6',
    name: 'Video Script Creator',
    description: 'Generate scripts for educational or promotional healthcare videos',
    type: 'video_script',
    steps: 4,
    isFavorite: false,
    isTemplate: true,
    tags: ['video', 'script', 'education'],
    usageCount: 3,
  },
];

const workflowConfig: Record<Workflow['type'], { label: string; color: string; icon: string }> = {
  calendar: { label: 'Calendar', color: 'bg-blue-100 text-blue-800', icon: '📅' },
  campaign: { label: 'Campaign', color: 'bg-purple-100 text-purple-800', icon: '🚀' },
  repurpose: { label: 'Repurpose', color: 'bg-green-100 text-green-800', icon: '♻️' },
  email_sequence: { label: 'Email', color: 'bg-pink-100 text-pink-800', icon: '✉️' },
  faq: { label: 'FAQ', color: 'bg-yellow-100 text-yellow-800', icon: '❓' },
  video_script: { label: 'Video', color: 'bg-red-100 text-red-800', icon: '🎬' },
  research_summary: { label: 'Research', color: 'bg-indigo-100 text-indigo-800', icon: '📊' },
  competitor_analysis: { label: 'Competitor', color: 'bg-orange-100 text-orange-800', icon: '🎯' },
  website_review: { label: 'Website', color: 'bg-cyan-100 text-cyan-800', icon: '🌐' },
  seo_optimization: { label: 'SEO', color: 'bg-teal-100 text-teal-800', icon: '🔍' },
  custom: { label: 'Custom', color: 'bg-gray-100 text-gray-800', icon: '⚙️' },
};

export default function AIWorkflows() {
  const [workflows, setWorkflows] = useState<Workflow[]>(defaultWorkflows);
  const [activeTab, setActiveTab] = useState('all');

  const handleToggleFavorite = (id: string) => {
    setWorkflows(workflows.map(w => w.id === id ? { ...w, isFavorite: !w.isFavorite } : w));
  };

  const handleDuplicateWorkflow = (workflow: Workflow) => {
    const newWorkflow: Workflow = {
      ...workflow,
      id: `wf-${Date.now()}`,
      name: `${workflow.name} (Copy)`,
      isTemplate: false,
      usageCount: 0,
    };
    setWorkflows([...workflows, newWorkflow]);
  };

  const handleDeleteWorkflow = (id: string) => {
    setWorkflows(workflows.filter(w => w.id !== id));
  };

  const filteredWorkflows = workflows.filter(w => {
    if (activeTab === 'favorites') return w.isFavorite;
    if (activeTab === 'templates') return w.isTemplate;
    if (activeTab === 'custom') return !w.isTemplate;
    return true;
  });

  return (
    <div className="flex h-full flex-col space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Workflows</h1>
          <p className="text-muted-foreground">
            Reusable AI-powered workflows to automate your content creation and marketing tasks.
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create Workflow
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All ({workflows.length})</TabsTrigger>
          <TabsTrigger value="favorites">Favorites ({workflows.filter(w => w.isFavorite).length})</TabsTrigger>
          <TabsTrigger value="templates">Templates ({workflows.filter(w => w.isTemplate).length})</TabsTrigger>
          <TabsTrigger value="custom">Custom ({workflows.filter(w => !w.isTemplate).length})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <ScrollArea className="h-[calc(100vh-400px)]">
            <div className="space-y-4 pr-4">
              {filteredWorkflows.map((workflow) => (
                <Card key={workflow.id} className="hover:border-primary/50 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">{workflowConfig[workflow.type].icon}</span>
                          <CardTitle className="text-base">{workflow.name}</CardTitle>
                        </div>
                        <Badge className={workflowConfig[workflow.type].color}>
                          {workflowConfig[workflow.type].label}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggleFavorite(workflow.id)}
                      >
                        <Star
                          className={`h-4 w-4 ${workflow.isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`}
                        />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{workflow.description}</p>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex gap-4">
                        <span>📍 {workflow.steps} steps</span>
                        <span>📊 Used {workflow.usageCount} times</span>
                      </div>
                      {workflow.isTemplate && (
                        <Badge variant="secondary" className="text-xs">Template</Badge>
                      )}
                    </div>

                    {workflow.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {workflow.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-2 pt-2 border-t">
                      <Button variant="default" size="sm" className="flex-1 gap-2">
                        <Play className="h-3 w-3" />
                        Run Workflow
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDuplicateWorkflow(workflow)}
                        className="gap-2"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      {!workflow.isTemplate && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteWorkflow(workflow.id)}
                          className="text-destructive hover:text-destructive gap-2"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
