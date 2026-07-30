import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Trash2, Edit2, BarChart3 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface ContentPillar {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon: string;
  isDefault: boolean;
  usageCount: number;
}

const defaultPillars: ContentPillar[] = [
  {
    id: 'pillar1',
    name: 'Educational',
    description: 'In-depth guides, how-tos, and educational content',
    color: '#3B82F6',
    icon: '📚',
    isDefault: true,
    usageCount: 24,
  },
  {
    id: 'pillar2',
    name: 'Frequently Asked Questions',
    description: 'Common questions from patients and community',
    color: '#10B981',
    icon: '❓',
    isDefault: true,
    usageCount: 18,
  },
  {
    id: 'pillar3',
    name: 'Tips',
    description: 'Quick tips and actionable advice',
    color: '#F59E0B',
    icon: '💡',
    isDefault: true,
    usageCount: 32,
  },
  {
    id: 'pillar4',
    name: 'Myth vs Fact',
    description: 'Debunking myths and clarifying misconceptions',
    color: '#EF4444',
    icon: '🔍',
    isDefault: true,
    usageCount: 12,
  },
  {
    id: 'pillar5',
    name: 'Patient Stories',
    description: 'Real patient testimonials and success stories',
    color: '#8B5CF6',
    icon: '💬',
    isDefault: true,
    usageCount: 8,
  },
  {
    id: 'pillar6',
    name: 'Behind the Scenes',
    description: 'Team updates and clinic culture',
    color: '#EC4899',
    icon: '👥',
    isDefault: true,
    usageCount: 15,
  },
  {
    id: 'pillar7',
    name: 'News & Updates',
    description: 'Industry news and practice updates',
    color: '#06B6D4',
    icon: '📰',
    isDefault: true,
    usageCount: 10,
  },
  {
    id: 'pillar8',
    name: 'Seasonal',
    description: 'Seasonal health tips and awareness',
    color: '#14B8A6',
    icon: '🌍',
    isDefault: true,
    usageCount: 6,
  },
];

export default function ContentPillarsPage() {
  const [pillars, setPillars] = useState<ContentPillar[]>(defaultPillars);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<ContentPillar>>({});

  const handleCreatePillar = () => {
    if (!formData.name) return;

    const newPillar: ContentPillar = {
      id: `pillar-${Date.now()}`,
      name: formData.name,
      description: formData.description,
      color: formData.color || '#3B82F6',
      icon: formData.icon || '📌',
      isDefault: false,
      usageCount: 0,
    };

    setPillars([...pillars, newPillar]);
    setFormData({});
    setIsDialogOpen(false);
  };

  const handleDeletePillar = (id: string) => {
    setPillars(pillars.filter(p => p.id !== id));
  };

  const totalUsage = pillars.reduce((sum, p) => sum + p.usageCount, 0);

  return (
    <div className="flex h-full flex-col space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Content Pillars</h1>
          <p className="text-muted-foreground">
            Define and organize your content strategy with reusable content pillars.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Pillar
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Content Pillar</DialogTitle>
              <DialogDescription>
                Define a new content pillar for your content calendar.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="pillar-name">Pillar Name</Label>
                <Input
                  id="pillar-name"
                  placeholder="e.g., Patient Success Stories"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="pillar-description">Description</Label>
                <Textarea
                  id="pillar-description"
                  placeholder="Describe this content pillar..."
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="pillar-icon">Icon (emoji)</Label>
                  <Input
                    id="pillar-icon"
                    placeholder="e.g., 🎯"
                    value={formData.icon || ''}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    maxLength={2}
                  />
                </div>

                <div>
                  <Label htmlFor="pillar-color">Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="pillar-color"
                      type="color"
                      value={formData.color || '#3B82F6'}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="h-10 w-14 p-1 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={formData.color || '#3B82F6'}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              <Button onClick={handleCreatePillar} className="w-full">
                Create Pillar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Pillars</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pillars.length}</div>
            <p className="text-xs text-muted-foreground mt-1">{defaultPillars.length} default pillars</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsage}</div>
            <p className="text-xs text-muted-foreground mt-1">posts across all pillars</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Most Used</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pillars.length > 0 ? Math.max(...pillars.map(p => p.usageCount)) : 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {pillars.length > 0 ? pillars.find(p => p.usageCount === Math.max(...pillars.map(p => p.usageCount)))?.name : 'N/A'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Pillars Grid */}
      <ScrollArea className="flex-1 pr-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pillars.map((pillar) => (
            <Card key={pillar.id} className="flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div
                      className="text-2xl"
                      style={{ opacity: 0.8 }}
                    >
                      {pillar.icon}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-base">{pillar.name}</CardTitle>
                      {pillar.isDefault && (
                        <Badge variant="secondary" className="mt-1 text-xs">Default</Badge>
                      )}
                    </div>
                  </div>
                  {!pillar.isDefault && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => handleDeletePillar(pillar.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col space-y-4">
                {pillar.description && (
                  <p className="text-sm text-muted-foreground">{pillar.description}</p>
                )}

                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold text-muted-foreground">Usage</p>
                    <p className="text-sm font-bold">{pillar.usageCount} posts</p>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full transition-all"
                      style={{
                        width: `${(pillar.usageCount / Math.max(...pillars.map(p => p.usageCount), 1)) * 100}%`,
                        backgroundColor: pillar.color,
                      }}
                    />
                  </div>
                </div>

                <div
                  className="h-8 rounded-md"
                  style={{ backgroundColor: pillar.color, opacity: 0.2 }}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
