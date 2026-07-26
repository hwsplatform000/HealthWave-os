import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Trash2, Edit2, Copy } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface SpecialtyProfile {
  id: string;
  name: string;
  slug: string;
  description: string;
  keyTopics: string[];
  targetAudience: string;
  complianceGuidelines: string;
}

const defaultSpecialties: SpecialtyProfile[] = [
  {
    id: 'sp1',
    name: 'Mental Health',
    slug: 'mental-health',
    description: 'Mental health and behavioral wellness services',
    keyTopics: ['Anxiety', 'Depression', 'Stress Management', 'Mindfulness'],
    targetAudience: 'Adults seeking mental health support',
    complianceGuidelines: 'HIPAA compliant, avoid medical claims, include crisis resources',
  },
  {
    id: 'sp2',
    name: 'Dentistry',
    slug: 'dentistry',
    description: 'Dental care and oral health services',
    keyTopics: ['Preventive Care', 'Cosmetic Dentistry', 'Orthodontics', 'Implants'],
    targetAudience: 'Patients seeking dental services',
    complianceGuidelines: 'FDA guidelines for dental claims, before/after photo policies',
  },
  {
    id: 'sp3',
    name: 'Cardiology',
    slug: 'cardiology',
    description: 'Heart and cardiovascular health services',
    keyTopics: ['Heart Health', 'Prevention', 'Treatment Options', 'Lifestyle'],
    targetAudience: 'Patients with cardiovascular concerns',
    complianceGuidelines: 'Strict medical accuracy, cite peer-reviewed studies',
  },
  {
    id: 'sp4',
    name: 'Dermatology',
    slug: 'dermatology',
    description: 'Skin health and dermatological services',
    keyTopics: ['Skin Care', 'Acne Treatment', 'Anti-Aging', 'Skin Conditions'],
    targetAudience: 'Patients seeking skin treatments',
    complianceGuidelines: 'Photo consent policies, realistic expectations',
  },
  {
    id: 'sp5',
    name: 'Pediatrics',
    slug: 'pediatrics',
    description: 'Child and adolescent healthcare services',
    keyTopics: ['Child Development', 'Vaccinations', 'Nutrition', 'Behavioral Health'],
    targetAudience: 'Parents and caregivers',
    complianceGuidelines: 'Child safety focus, parental consent, age-appropriate content',
  },
  {
    id: 'sp6',
    name: 'Weight Management',
    slug: 'weight-management',
    description: 'Weight loss and weight management services',
    keyTopics: ['Nutrition', 'Exercise', 'Behavioral Change', 'Medical Weight Loss'],
    targetAudience: 'Adults seeking weight management',
    complianceGuidelines: 'No unrealistic claims, health-first messaging',
  },
];

export default function SpecialtyProfiles() {
  const [specialties, setSpecialties] = useState<SpecialtyProfile[]>(defaultSpecialties);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<SpecialtyProfile>>({});

  const handleCreateSpecialty = () => {
    if (!formData.name || !formData.slug) return;

    const newSpecialty: SpecialtyProfile = {
      id: `sp-${Date.now()}`,
      name: formData.name,
      slug: formData.slug,
      description: formData.description || '',
      keyTopics: formData.keyTopics || [],
      targetAudience: formData.targetAudience || '',
      complianceGuidelines: formData.complianceGuidelines || '',
    };

    setSpecialties([...specialties, newSpecialty]);
    setFormData({});
    setIsDialogOpen(false);
  };

  const handleDeleteSpecialty = (id: string) => {
    setSpecialties(specialties.filter(s => s.id !== id));
  };

  const handleDuplicateSpecialty = (specialty: SpecialtyProfile) => {
    const newSpecialty: SpecialtyProfile = {
      ...specialty,
      id: `sp-${Date.now()}`,
      name: `${specialty.name} (Copy)`,
      slug: `${specialty.slug}-copy`,
    };
    setSpecialties([...specialties, newSpecialty]);
  };

  return (
    <div className="flex h-full flex-col space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Healthcare Specialty Profiles</h1>
          <p className="text-muted-foreground">
            Define specialty-specific guidelines, topics, and compliance requirements.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Specialty
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Specialty Profile</DialogTitle>
              <DialogDescription>
                Define a new healthcare specialty with key topics and compliance guidelines.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Specialty Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Mental Health"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="slug">URL Slug</Label>
                  <Input
                    id="slug"
                    placeholder="e.g., mental-health"
                    value={formData.slug || ''}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe this specialty..."
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="topics">Key Topics (comma-separated)</Label>
                <Textarea
                  id="topics"
                  placeholder="e.g., Anxiety, Depression, Stress Management"
                  value={(formData.keyTopics || []).join(', ')}
                  onChange={(e) => setFormData({ ...formData, keyTopics: e.target.value.split(',').map(t => t.trim()) })}
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="audience">Target Audience</Label>
                <Input
                  id="audience"
                  placeholder="e.g., Adults seeking mental health support"
                  value={formData.targetAudience || ''}
                  onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="compliance">Compliance Guidelines</Label>
                <Textarea
                  id="compliance"
                  placeholder="Describe compliance requirements..."
                  value={formData.complianceGuidelines || ''}
                  onChange={(e) => setFormData({ ...formData, complianceGuidelines: e.target.value })}
                  rows={3}
                />
              </div>

              <Button onClick={handleCreateSpecialty} className="w-full">
                Create Specialty
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Specialties Grid */}
      <ScrollArea className="flex-1 pr-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {specialties.map((specialty) => (
            <Card key={specialty.id} className="flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-base">{specialty.name}</CardTitle>
                    <Badge variant="outline" className="mt-2 text-xs">
                      {specialty.slug}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleDuplicateSpecialty(specialty)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => handleDeleteSpecialty(specialty.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col space-y-3 text-sm">
                {specialty.description && (
                  <div>
                    <p className="text-xs text-muted-foreground font-semibold">Description</p>
                    <p className="text-xs line-clamp-2">{specialty.description}</p>
                  </div>
                )}

                {specialty.keyTopics.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground font-semibold">Key Topics</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {specialty.keyTopics.map((topic) => (
                        <Badge key={topic} variant="secondary" className="text-[10px]">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {specialty.targetAudience && (
                  <div>
                    <p className="text-xs text-muted-foreground font-semibold">Target Audience</p>
                    <p className="text-xs line-clamp-2">{specialty.targetAudience}</p>
                  </div>
                )}

                {specialty.complianceGuidelines && (
                  <div>
                    <p className="text-xs text-muted-foreground font-semibold">Compliance</p>
                    <p className="text-xs line-clamp-2">{specialty.complianceGuidelines}</p>
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
