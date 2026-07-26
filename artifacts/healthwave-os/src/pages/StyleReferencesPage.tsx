import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, Star, Search, Image as ImageIcon, Palette, FileText, Link as LinkIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface StyleReference {
  id: string;
  name: string;
  type: 'image' | 'logo' | 'brand_guide' | 'color_palette' | 'font' | 'inspiration';
  url: string;
  thumbnailUrl?: string;
  tags: string[];
  collection?: string;
  notes?: string;
}

const defaultReferences: StyleReference[] = [
  {
    id: 'sr1',
    name: 'Primary Logo',
    type: 'logo',
    url: 'https://example.com/logo.png',
    tags: ['logo', 'primary', 'brand'],
    collection: 'Brand Assets',
    notes: 'Main logo for all platforms',
  },
  {
    id: 'sr2',
    name: 'Brand Color Palette',
    type: 'color_palette',
    url: 'https://example.com/colors.png',
    tags: ['colors', 'palette', 'brand'],
    collection: 'Brand Assets',
    notes: 'Primary: #0066CC, Secondary: #00AA66',
  },
  {
    id: 'sr3',
    name: 'Instagram Feed Inspiration',
    type: 'inspiration',
    url: 'https://example.com/instagram.png',
    tags: ['instagram', 'social', 'inspiration'],
    collection: 'Social Media',
    notes: 'Aesthetic and layout reference',
  },
];

const typeConfig: Record<StyleReference['type'], { icon: any; label: string; color: string }> = {
  image: { icon: ImageIcon, label: 'Image', color: 'text-hw-blue' },
  logo: { icon: ImageIcon, label: 'Logo', color: 'text-hw-purple' },
  brand_guide: { icon: FileText, label: 'Brand Guide', color: 'text-hw-green' },
  color_palette: { icon: Palette, label: 'Color Palette', color: 'text-hw-yellow' },
  font: { icon: FileText, label: 'Font', color: 'text-hw-cyan' },
  inspiration: { icon: ImageIcon, label: 'Inspiration', color: 'text-hw-red' },
};

export default function StyleReferencesPage() {
  const [references, setReferences] = useState<StyleReference[]>(defaultReferences);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<StyleReference['type'] | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<StyleReference>>({});

  const types = Array.from(new Set(references.map(r => r.type))) as StyleReference['type'][];
  const collections = Array.from(new Set(references.map(r => r.collection).filter(Boolean)));

  const filteredReferences = references.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = !selectedType || r.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleCreateReference = () => {
    if (!formData.name || !formData.url || !formData.type) return;

    const newReference: StyleReference = {
      id: `sr-${Date.now()}`,
      name: formData.name,
      type: formData.type,
      url: formData.url,
      thumbnailUrl: formData.thumbnailUrl,
      tags: formData.tags || [],
      collection: formData.collection,
      notes: formData.notes,
    };

    setReferences([...references, newReference]);
    setFormData({});
    setIsDialogOpen(false);
  };

  const handleDeleteReference = (id: string) => {
    setReferences(references.filter(r => r.id !== id));
  };

  return (
    <div className="flex h-full flex-col space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Style Reference Library</h1>
          <p className="text-muted-foreground">
            Upload and organize brand assets for AI content generation reference.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Reference
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Style Reference</DialogTitle>
              <DialogDescription>
                Upload or link brand assets for AI to reference during content generation.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Reference Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Primary Logo"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="type">Type</Label>
                  <select
                    id="type"
                    value={formData.type || ''}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-md bg-background text-foreground"
                  >
                    <option value="">Select type</option>
                    <option value="image">Image</option>
                    <option value="logo">Logo</option>
                    <option value="brand_guide">Brand Guide</option>
                    <option value="color_palette">Color Palette</option>
                    <option value="font">Font</option>
                    <option value="inspiration">Inspiration</option>
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="url">URL or Upload</Label>
                <Input
                  id="url"
                  placeholder="https://example.com/image.png"
                  value={formData.url || ''}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="collection">Collection (Optional)</Label>
                <Input
                  id="collection"
                  placeholder="e.g., Brand Assets"
                  value={formData.collection || ''}
                  onChange={(e) => setFormData({ ...formData, collection: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  placeholder="e.g., logo, primary, brand"
                  value={(formData.tags || []).join(', ')}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(',').map(t => t.trim()) })}
                />
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Add notes about this reference..."
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                />
              </div>

              <Button onClick={handleCreateReference} className="w-full">
                Add Reference
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
            placeholder="Search references..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={selectedType === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedType(null)}
          >
            All
          </Button>
          {types.map((type) => (
            <Button
              key={type}
              variant={selectedType === type ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedType(type)}
            >
              {typeConfig[type].label}
            </Button>
          ))}
        </div>
      </div>

      {/* References Grid */}
      <ScrollArea className="flex-1 pr-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredReferences.map((ref) => {
            const config = typeConfig[ref.type];
            const Icon = config.icon;

            return (
              <Card key={ref.id} className="flex flex-col overflow-hidden">
                {/* Thumbnail */}
                <div className="h-32 bg-muted/50 flex items-center justify-center border-b">
                  {ref.thumbnailUrl ? (
                    <img src={ref.thumbnailUrl} alt={ref.name} className="w-full h-full object-cover" />
                  ) : (
                    <Icon className={`h-8 w-8 ${config.color} opacity-50`} />
                  )}
                </div>

                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-sm">{ref.name}</CardTitle>
                      <Badge variant="outline" className="mt-2 text-xs">
                        {config.label}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => handleDeleteReference(ref.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col space-y-2">
                  {ref.collection && (
                    <div>
                      <p className="text-xs text-muted-foreground font-semibold">Collection</p>
                      <p className="text-xs">{ref.collection}</p>
                    </div>
                  )}

                  {ref.notes && (
                    <div>
                      <p className="text-xs text-muted-foreground font-semibold">Notes</p>
                      <p className="text-xs line-clamp-2">{ref.notes}</p>
                    </div>
                  )}

                  {ref.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-2">
                      {ref.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-[10px]">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full h-8 text-xs mt-2"
                    onClick={() => window.open(ref.url, '_blank')}
                  >
                    <LinkIcon className="h-3 w-3 mr-1" />
                    View
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
