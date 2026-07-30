import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, TrendingDown, Minus, Zap, Search } from 'lucide-react';

interface Trend {
  id: string;
  title: string;
  description: string;
  category: 'healthcare' | 'ai' | 'marketing' | 'social' | 'algorithm' | 'seasonal' | 'awareness' | 'viral' | 'competitor';
  trendType: 'rising' | 'declining' | 'stable' | 'seasonal';
  relevanceScore: number;
  specialty?: string;
  location?: string;
  source: string;
  tags: string[];
  detectedAt: string;
}

const defaultTrends: Trend[] = [
  {
    id: 'trend1',
    title: 'AI-Generated Patient Education Content',
    description: 'Healthcare providers increasingly using AI to create personalized patient education materials',
    category: 'ai',
    trendType: 'rising',
    relevanceScore: 95,
    specialty: 'General',
    source: 'Healthcare IT News',
    tags: ['AI', 'patient-education', 'content-generation'],
    detectedAt: new Date().toISOString(),
  },
  {
    id: 'trend2',
    title: 'Mental Health Awareness Month',
    description: 'May marks Mental Health Awareness Month with increased focus on mental wellness content',
    category: 'awareness',
    trendType: 'seasonal',
    relevanceScore: 88,
    specialty: 'Mental Health',
    source: 'NAMI',
    tags: ['mental-health', 'awareness', 'seasonal'],
    detectedAt: new Date().toISOString(),
  },
  {
    id: 'trend3',
    title: 'Social Media Algorithm Changes',
    description: 'Instagram and TikTok prioritizing authentic healthcare content over promotional posts',
    category: 'algorithm',
    trendType: 'rising',
    relevanceScore: 92,
    source: 'Social Media Today',
    tags: ['social-media', 'algorithm', 'engagement'],
    detectedAt: new Date().toISOString(),
  },
  {
    id: 'trend4',
    title: 'Telehealth Adoption Plateau',
    description: 'Telehealth growth stabilizing as market reaches maturity',
    category: 'healthcare',
    trendType: 'stable',
    relevanceScore: 75,
    source: 'Statista',
    tags: ['telehealth', 'digital-health'],
    detectedAt: new Date().toISOString(),
  },
];

const categoryConfig: Record<Trend['category'], { label: string; color: string }> = {
  healthcare: { label: 'Healthcare', color: 'bg-blue-100 text-blue-800' },
  ai: { label: 'AI & Tech', color: 'bg-purple-100 text-purple-800' },
  marketing: { label: 'Marketing', color: 'bg-pink-100 text-pink-800' },
  social: { label: 'Social Media', color: 'bg-green-100 text-green-800' },
  algorithm: { label: 'Algorithm', color: 'bg-orange-100 text-orange-800' },
  seasonal: { label: 'Seasonal', color: 'bg-yellow-100 text-yellow-800' },
  awareness: { label: 'Awareness', color: 'bg-red-100 text-red-800' },
  viral: { label: 'Viral', color: 'bg-indigo-100 text-indigo-800' },
  competitor: { label: 'Competitor', color: 'bg-gray-100 text-gray-800' },
};

export default function TrendCenter() {
  const [trends, setTrends] = useState<Trend[]>(defaultTrends);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Trend['category'] | null>(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);

  const categories = Array.from(new Set(trends.map(t => t.category))) as Trend['category'][];
  const specialties = Array.from(new Set(trends.map(t => t.specialty).filter(Boolean)));

  const filteredTrends = trends.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = !selectedCategory || t.category === selectedCategory;
    const matchesSpecialty = !selectedSpecialty || t.specialty === selectedSpecialty;
    return matchesSearch && matchesCategory && matchesSpecialty;
  });

  const getTrendIcon = (type: Trend['trendType']) => {
    switch (type) {
      case 'rising':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'declining':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      case 'stable':
        return <Minus className="h-4 w-4 text-blue-600" />;
      case 'seasonal':
        return <Zap className="h-4 w-4 text-yellow-600" />;
    }
  };

  return (
    <div className="flex h-full flex-col space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Trend Center</h1>
        <p className="text-muted-foreground mt-1">
          Stay informed about healthcare, AI, and marketing trends relevant to your practice.
        </p>
      </div>

      {/* Search & Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search trends..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex flex-col gap-3 md:flex-row">
          <div className="flex-1">
            <Label className="text-xs text-muted-foreground mb-2 block">Category</Label>
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
                  {categoryConfig[cat].label}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex-1">
            <Label className="text-xs text-muted-foreground mb-2 block">Specialty</Label>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedSpecialty === null ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedSpecialty(null)}
              >
                All
              </Button>
              {specialties.map((specialty) => (
                <Button
                  key={specialty}
                  variant={selectedSpecialty === specialty ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedSpecialty(specialty)}
                >
                  {specialty}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Trends List */}
      <ScrollArea className="flex-1 pr-4">
        <div className="space-y-4">
          {filteredTrends.map((trend) => (
            <Card key={trend.id} className="hover:border-primary/50 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {getTrendIcon(trend.trendType)}
                      <CardTitle className="text-base">{trend.title}</CardTitle>
                    </div>
                    <Badge className={categoryConfig[trend.category].color}>
                      {categoryConfig[trend.category].label}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">{trend.relevanceScore}</div>
                    <p className="text-xs text-muted-foreground">Relevance</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">{trend.description}</p>

                <div className="flex flex-wrap gap-2">
                  {trend.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                  <div className="flex gap-4">
                    {trend.specialty && <span>📍 {trend.specialty}</span>}
                    <span>📰 {trend.source}</span>
                  </div>
                  <span>{new Date(trend.detectedAt).toLocaleDateString()}</span>
                </div>

                <Button variant="outline" size="sm" className="w-full mt-2">
                  Create Content Based on This Trend
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
