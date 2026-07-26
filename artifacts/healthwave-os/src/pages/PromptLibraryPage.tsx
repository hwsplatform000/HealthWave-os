import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, Copy, Star, Search } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface PromptTemplate {
  id: string;
  title: string;
  category: string;
  prompt: string;
  isFavorite: boolean;
  tags: string[];
}

const defaultPrompts: PromptTemplate[] = [
  {
    id: 'pt1',
    title: 'Educational Post Hook',
    category: 'Educational',
    prompt: 'Write an engaging hook for an educational post about [TOPIC] targeting [AUDIENCE]. The hook should create curiosity and promise value within 2 sentences.',
    isFavorite: true,
    tags: ['hook', 'educational', 'social'],
  },
  {
    id: 'pt2',
    title: 'Patient FAQ Answer',
    category: 'Patient Engagement',
    prompt: 'Answer the following patient question in a clear, empathetic, and medically accurate way: [QUESTION]. Include a brief explanation and a gentle CTA to consult a healthcare provider.',
    isFavorite: true,
    tags: ['faq', 'patient', 'educational'],
  },
  {
    id: 'pt3',
    title: 'Instagram Caption — Healthcare Tip',
    category: 'Social Media',
    prompt: 'Write an Instagram caption for a healthcare tip about [TOPIC]. Include: 1) An attention-grabbing first line, 2) 3-4 key points as bullet points, 3) A CTA, 4) 5-8 relevant hashtags.',
    isFavorite: false,
    tags: ['instagram', 'caption', 'tips'],
  },
  {
    id: 'pt4',
    title: 'LinkedIn Thought Leadership',
    category: 'Social Media',
    prompt: 'Write a LinkedIn article introduction about [TOPIC] in healthcare. Position the author as a thought leader. Use a personal anecdote or surprising statistic to open.',
    isFavorite: true,
    tags: ['linkedin', 'thought-leadership', 'article'],
  },
];

export default function PromptLibraryPage() {
  const [prompts, setPrompts] = useState<PromptTemplate[]>(defaultPrompts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<PromptTemplate>>({});

  const categories = Array.from(new Set(prompts.map(p => p.category)));
  const filteredPrompts = prompts.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.prompt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCreatePrompt = () => {
    if (!formData.title || !formData.prompt) return;

    const newPrompt: PromptTemplate = {
      id: `pt-${Date.now()}`,
      title: formData.title,
      category: formData.category || 'Custom',
      prompt: formData.prompt,
      isFavorite: false,
      tags: formData.tags || [],
    };

    setPrompts([...prompts, newPrompt]);
    setFormData({});
    setIsDialogOpen(false);
  };

  const handleDeletePrompt = (id: string) => {
    setPrompts(prompts.filter(p => p.id !== id));
  };

  const handleToggleFavorite = (id: string) => {
    setPrompts(prompts.map(p => p.id === id ? { ...p, isFavorite: !p.isFavorite } : p));
  };

  const handleDuplicatePrompt = (prompt: PromptTemplate) => {
    const newPrompt: PromptTemplate = {
      ...prompt,
      id: `pt-${Date.now()}`,
      title: `${prompt.title} (Copy)`,
    };
    setPrompts([...prompts, newPrompt]);
  };

  return (
    <div className="flex h-full flex-col space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Prompt Library</h1>
          <p className="text-muted-foreground">
            Save and reuse prompt templates for consistent AI content generation.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Prompt
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Prompt Template</DialogTitle>
              <DialogDescription>
                Create a reusable prompt template with variables for AI generation.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Prompt Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Educational Post Hook"
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    placeholder="e.g., Educational"
                    value={formData.category || ''}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="prompt">Prompt Template</Label>
                <Textarea
                  id="prompt"
                  placeholder="Write your prompt here. Use [VARIABLE] for placeholders..."
                  value={formData.prompt || ''}
                  onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
                  rows={6}
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Use [VARIABLE] syntax for dynamic placeholders that users can fill in.
                </p>
              </div>

              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  placeholder="e.g., hook, educational, social"
                  value={(formData.tags || []).join(', ')}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(',').map(t => t.trim()) })}
                />
              </div>

              <Button onClick={handleCreatePrompt} className="w-full">
                Create Prompt
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search prompts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={selectedCategory === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            All
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Prompts Grid */}
      <ScrollArea className="flex-1 pr-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredPrompts.map((prompt) => (
            <Card key={prompt.id} className="flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-base">{prompt.title}</CardTitle>
                    <Badge variant="outline" className="mt-2 text-xs">
                      {prompt.category}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleToggleFavorite(prompt.id)}
                  >
                    <Star className={`h-4 w-4 ${prompt.isFavorite ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col space-y-3">
                <p className="text-xs leading-relaxed text-muted-foreground line-clamp-3">
                  {prompt.prompt}
                </p>

                {prompt.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {prompt.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-[10px]">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="flex gap-2 pt-2 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 h-8 text-xs"
                    onClick={() => handleDuplicatePrompt(prompt)}
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Duplicate
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    onClick={() => handleDeletePrompt(prompt.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
