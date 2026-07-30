import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Trash2, Edit2, Link as LinkIcon, Globe } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface Competitor {
  id: string;
  name: string;
  website?: string;
  blog?: string;
  specialty?: string;
  location?: string;
  seoKeywords: string[];
  postingFrequency?: string;
  contentCategories: string[];
  notes?: string;
}

const defaultCompetitors: Competitor[] = [
  {
    id: 'comp1',
    name: 'Wellness Plus Clinic',
    website: 'https://wellnessplus.com',
    blog: 'https://wellnessplus.com/blog',
    specialty: 'General',
    location: 'New York, NY',
    seoKeywords: ['wellness', 'preventive care', 'holistic health'],
    postingFrequency: 'weekly',
    contentCategories: ['Tips', 'Patient Stories', 'Educational'],
    notes: 'Strong social media presence, active on Instagram and TikTok',
  },
  {
    id: 'comp2',
    name: 'Mental Health First',
    website: 'https://mentalhealthfirst.org',
    specialty: 'Mental Health',
    location: 'California',
    seoKeywords: ['mental health', 'therapy', 'counseling', 'anxiety'],
    postingFrequency: 'daily',
    contentCategories: ['Educational', 'FAQ', 'Testimonials'],
    notes: 'High engagement on LinkedIn and Facebook',
  },
  {
    id: 'comp3',
    name: 'Dental Excellence',
    website: 'https://dentalexcellence.com',
    specialty: 'Dentistry',
    location: 'Texas',
    seoKeywords: ['dental care', 'cosmetic dentistry', 'implants'],
    postingFrequency: 'weekly',
    contentCategories: ['Before/After', 'Tips', 'Behind the Scenes'],
    notes: 'Excellent before/after content strategy',
  },
];

export default function CompetitorsPage() {
  const [competitors, setCompetitors] = useState<Competitor[]>(defaultCompetitors);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Competitor>>({});

  const handleCreateCompetitor = () => {
    if (!formData.name) return;

    const newCompetitor: Competitor = {
      id: `comp-${Date.now()}`,
      name: formData.name,
      website: formData.website,
      blog: formData.blog,
      specialty: formData.specialty,
      location: formData.location,
      seoKeywords: formData.seoKeywords || [],
      postingFrequency: formData.postingFrequency,
      contentCategories: formData.contentCategories || [],
      notes: formData.notes,
    };

    setCompetitors([...competitors, newCompetitor]);
    setFormData({});
    setIsDialogOpen(false);
  };

  const handleDeleteCompetitor = (id: string) => {
    setCompetitors(competitors.filter(c => c.id !== id));
  };

  return (
    <div className="flex h-full flex-col space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Competitor Intelligence</h1>
          <p className="text-muted-foreground">
            Track and analyze your healthcare competitors' strategies and content.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Competitor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Competitor Profile</DialogTitle>
              <DialogDescription>
                Track competitor information and content strategy.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Competitor Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Wellness Plus Clinic"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="specialty">Specialty</Label>
                  <Input
                    id="specialty"
                    placeholder="e.g., General, Mental Health"
                    value={formData.specialty || ''}
                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    placeholder="https://example.com"
                    value={formData.website || ''}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="blog">Blog URL</Label>
                  <Input
                    id="blog"
                    placeholder="https://example.com/blog"
                    value={formData.blog || ''}
                    onChange={(e) => setFormData({ ...formData, blog: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="e.g., New York, NY"
                  value={formData.location || ''}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="keywords">SEO Keywords (comma-separated)</Label>
                <Textarea
                  id="keywords"
                  placeholder="e.g., wellness, preventive care, holistic health"
                  value={(formData.seoKeywords || []).join(', ')}
                  onChange={(e) => setFormData({ ...formData, seoKeywords: e.target.value.split(',').map(k => k.trim()) })}
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="categories">Content Categories (comma-separated)</Label>
                <Textarea
                  id="categories"
                  placeholder="e.g., Tips, Patient Stories, Educational"
                  value={(formData.contentCategories || []).join(', ')}
                  onChange={(e) => setFormData({ ...formData, contentCategories: e.target.value.split(',').map(c => c.trim()) })}
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any notes about this competitor..."
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                />
              </div>

              <Button onClick={handleCreateCompetitor} className="w-full">
                Add Competitor
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Competitors Grid */}
      <ScrollArea className="flex-1 pr-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {competitors.map((competitor) => (
            <Card key={competitor.id} className="flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-base">{competitor.name}</CardTitle>
                    {competitor.specialty && (
                      <Badge variant="outline" className="mt-2 text-xs">
                        {competitor.specialty}
                      </Badge>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => handleDeleteCompetitor(competitor.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col space-y-3 text-sm">
                {competitor.location && (
                  <div>
                    <p className="text-xs text-muted-foreground font-semibold">Location</p>
                    <p className="text-xs">{competitor.location}</p>
                  </div>
                )}

                {competitor.website && (
                  <div>
                    <p className="text-xs text-muted-foreground font-semibold">Website</p>
                    <a
                      href={competitor.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline flex items-center gap-1"
                    >
                      <Globe className="h-3 w-3" />
                      Visit
                    </a>
                  </div>
                )}

                {competitor.postingFrequency && (
                  <div>
                    <p className="text-xs text-muted-foreground font-semibold">Posting Frequency</p>
                    <p className="text-xs capitalize">{competitor.postingFrequency}</p>
                  </div>
                )}

                {competitor.contentCategories.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground font-semibold">Content Types</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {competitor.contentCategories.map((cat) => (
                        <Badge key={cat} variant="secondary" className="text-[10px]">
                          {cat}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {competitor.seoKeywords.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground font-semibold">SEO Keywords</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {competitor.seoKeywords.slice(0, 3).map((keyword) => (
                        <Badge key={keyword} variant="outline" className="text-[10px]">
                          {keyword}
                        </Badge>
                      ))}
                      {competitor.seoKeywords.length > 3 && (
                        <Badge variant="outline" className="text-[10px]">
                          +{competitor.seoKeywords.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {competitor.notes && (
                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground font-semibold">Notes</p>
                    <p className="text-xs line-clamp-2">{competitor.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
