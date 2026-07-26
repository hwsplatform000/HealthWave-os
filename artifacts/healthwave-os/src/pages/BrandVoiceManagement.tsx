import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, Edit2, Copy, Star } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface BrandVoice {
  id: string;
  name: string;
  specialty: string;
  tone: string;
  readingLevel: string;
  vocabulary: string;
  ctaStyle: string;
  emojiUsage: 'none' | 'minimal' | 'moderate' | 'frequent';
  formatting: string;
  hashtagStyle: string;
  compliancePreferences: string;
  writingExamples: string[];
  isDefault: boolean;
}

const defaultBrandVoices: BrandVoice[] = [
  {
    id: 'bv1',
    name: 'HealthWave Professional',
    specialty: 'General',
    tone: 'Professional & Empathetic',
    readingLevel: 'Grade 8-10',
    vocabulary: 'Medical but accessible',
    ctaStyle: 'Action-oriented',
    emojiUsage: 'minimal',
    formatting: 'Clear paragraphs with bullet points',
    hashtagStyle: 'Professional and educational',
    compliancePreferences: 'Standard HIPAA compliance',
    writingExamples: ['Example 1', 'Example 2'],
    isDefault: true,
  },
  {
    id: 'bv2',
    name: 'Mental Health Support',
    specialty: 'Mental Health',
    tone: 'Warm & Supportive',
    readingLevel: 'Grade 6-8',
    vocabulary: 'Compassionate, non-stigmatizing',
    ctaStyle: 'Gentle encouragement',
    emojiUsage: 'moderate',
    formatting: 'Short paragraphs, conversational',
    hashtagStyle: 'Supportive and awareness-focused',
    compliancePreferences: 'Strict mental health guidelines',
    writingExamples: ['Example 1', 'Example 2'],
    isDefault: false,
  },
];

export default function BrandVoiceManagement() {
  const [voices, setVoices] = useState<BrandVoice[]>(defaultBrandVoices);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVoice, setEditingVoice] = useState<BrandVoice | null>(null);
  const [formData, setFormData] = useState<Partial<BrandVoice>>({});

  const handleCreateVoice = () => {
    if (!formData.name || !formData.specialty) return;

    const newVoice: BrandVoice = {
      id: `bv-${Date.now()}`,
      name: formData.name,
      specialty: formData.specialty,
      tone: formData.tone || '',
      readingLevel: formData.readingLevel || '',
      vocabulary: formData.vocabulary || '',
      ctaStyle: formData.ctaStyle || '',
      emojiUsage: formData.emojiUsage || 'minimal',
      formatting: formData.formatting || '',
      hashtagStyle: formData.hashtagStyle || '',
      compliancePreferences: formData.compliancePreferences || '',
      writingExamples: formData.writingExamples || [],
      isDefault: false,
    };

    setVoices([...voices, newVoice]);
    setFormData({});
    setIsDialogOpen(false);
  };

  const handleDeleteVoice = (id: string) => {
    setVoices(voices.filter(v => v.id !== id));
  };

  const handleDuplicateVoice = (voice: BrandVoice) => {
    const newVoice: BrandVoice = {
      ...voice,
      id: `bv-${Date.now()}`,
      name: `${voice.name} (Copy)`,
      isDefault: false,
    };
    setVoices([...voices, newVoice]);
  };

  const handleSetDefault = (id: string) => {
    setVoices(voices.map(v => ({ ...v, isDefault: v.id === id })));
  };

  return (
    <div className="flex h-full flex-col space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Brand Voice Profiles</h1>
          <p className="text-muted-foreground">
            Create and manage brand voice profiles for consistent messaging across platforms.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Brand Voice
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Brand Voice Profile</DialogTitle>
              <DialogDescription>
                Define a new brand voice with tone, vocabulary, and style guidelines.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Brand Voice Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Mental Health Support"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="specialty">Specialty</Label>
                  <Select value={formData.specialty || ''} onValueChange={(val) => setFormData({ ...formData, specialty: val })}>
                    <SelectTrigger id="specialty">
                      <SelectValue placeholder="Select specialty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="mental_health">Mental Health</SelectItem>
                      <SelectItem value="dentistry">Dentistry</SelectItem>
                      <SelectItem value="plastic_surgery">Plastic Surgery</SelectItem>
                      <SelectItem value="vision">Vision</SelectItem>
                      <SelectItem value="weight_management">Weight Management</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tone">Tone</Label>
                  <Input
                    id="tone"
                    placeholder="e.g., Warm & Supportive"
                    value={formData.tone || ''}
                    onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="readingLevel">Reading Level</Label>
                  <Input
                    id="readingLevel"
                    placeholder="e.g., Grade 6-8"
                    value={formData.readingLevel || ''}
                    onChange={(e) => setFormData({ ...formData, readingLevel: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="vocabulary">Vocabulary</Label>
                <Input
                  id="vocabulary"
                  placeholder="e.g., Compassionate, non-stigmatizing"
                  value={formData.vocabulary || ''}
                  onChange={(e) => setFormData({ ...formData, vocabulary: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ctaStyle">CTA Style</Label>
                  <Input
                    id="ctaStyle"
                    placeholder="e.g., Gentle encouragement"
                    value={formData.ctaStyle || ''}
                    onChange={(e) => setFormData({ ...formData, ctaStyle: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="emoji">Emoji Usage</Label>
                  <Select value={formData.emojiUsage || 'minimal'} onValueChange={(val) => setFormData({ ...formData, emojiUsage: val as any })}>
                    <SelectTrigger id="emoji">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="minimal">Minimal</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="frequent">Frequent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="formatting">Formatting Guidelines</Label>
                <Textarea
                  id="formatting"
                  placeholder="Describe formatting preferences..."
                  value={formData.formatting || ''}
                  onChange={(e) => setFormData({ ...formData, formatting: e.target.value })}
                  rows={3}
                />
              </div>

              <Button onClick={handleCreateVoice} className="w-full">
                Create Brand Voice
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Brand Voices Grid */}
      <ScrollArea className="flex-1 pr-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {voices.map((voice) => (
            <Card key={voice.id} className={voice.isDefault ? 'ring-2 ring-primary' : ''}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-base">{voice.name}</CardTitle>
                      {voice.isDefault && (
                        <Badge variant="default" className="text-[10px]">Default</Badge>
                      )}
                    </div>
                    <Badge variant="outline" className="mt-2 text-xs">
                      {voice.specialty}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleSetDefault(voice.id)}
                    >
                      <Star className={`h-4 w-4 ${voice.isDefault ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleDuplicateVoice(voice)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => handleDeleteVoice(voice.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground font-semibold">Tone</p>
                  <p className="text-xs">{voice.tone}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-semibold">Vocabulary</p>
                  <p className="text-xs">{voice.vocabulary}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-semibold">Reading Level</p>
                  <p className="text-xs">{voice.readingLevel}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-semibold">CTA Style</p>
                  <p className="text-xs">{voice.ctaStyle}</p>
                </div>
                <div className="flex gap-1 flex-wrap pt-2">
                  <Badge variant="secondary" className="text-[10px]">
                    {voice.emojiUsage} emojis
                  </Badge>
                  <Badge variant="secondary" className="text-[10px]">
                    {voice.hashtagStyle}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
