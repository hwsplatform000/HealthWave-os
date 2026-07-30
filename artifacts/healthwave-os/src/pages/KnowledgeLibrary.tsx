import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Trash2, FileText, BookOpen, Link as LinkIcon, Upload, Search } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface KnowledgeItem {
  id: string;
  title: string;
  type: 'document' | 'sop' | 'playbook' | 'pdf' | 'research' | 'website' | 'note' | 'medical_reference';
  content?: string;
  url?: string;
  tags: string[];
  category?: string;
  summary?: string;
  createdAt: string;
}

const defaultItems: KnowledgeItem[] = [
  {
    id: 'kb1',
    title: 'Patient Communication Best Practices',
    type: 'playbook',
    summary: 'Guidelines for effective patient communication across all channels',
    tags: ['communication', 'patient', 'best-practices'],
    category: 'Marketing',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'kb2',
    title: 'Social Media Content Guidelines',
    type: 'sop',
    summary: 'Standard operating procedures for posting on social media platforms',
    tags: ['social-media', 'guidelines', 'compliance'],
    category: 'Social Media',
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'kb3',
    title: 'HIPAA Compliance Checklist',
    type: 'document',
    summary: 'Comprehensive checklist for HIPAA compliance in marketing',
    tags: ['compliance', 'hipaa', 'legal'],
    category: 'Compliance',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'kb4',
    title: 'Medical Terminology Reference',
    type: 'medical_reference',
    url: 'https://example.com/medical-terms',
    summary: 'Comprehensive guide to medical terms and their patient-friendly explanations',
    tags: ['medical', 'terminology', 'reference'],
    category: 'Medical',
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'kb5',
    title: 'Content Calendar Template',
    type: 'document',
    summary: 'Reusable template for monthly content planning',
    tags: ['calendar', 'planning', 'template'],
    category: 'Templates',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const typeConfig: Record<KnowledgeItem['type'], { label: string; icon: string; color: string }> = {
  document: { label: 'Document', icon: '📄', color: 'bg-blue-100 text-blue-800' },
  sop: { label: 'SOP', icon: '📋', color: 'bg-green-100 text-green-800' },
  playbook: { label: 'Playbook', icon: '📚', color: 'bg-purple-100 text-purple-800' },
  pdf: { label: 'PDF', icon: '📑', color: 'bg-red-100 text-red-800' },
  research: { label: 'Research', icon: '📊', color: 'bg-orange-100 text-orange-800' },
  website: { label: 'Website', icon: '🌐', color: 'bg-cyan-100 text-cyan-800' },
  note: { label: 'Note', icon: '📝', color: 'bg-yellow-100 text-yellow-800' },
  medical_reference: { label: 'Medical Ref', icon: '⚕️', color: 'bg-pink-100 text-pink-800' },
};

export default function KnowledgeLibrary() {
  const [items, setItems] = useState<KnowledgeItem[]>(defaultItems);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<KnowledgeItem['type'] | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<KnowledgeItem>>({});

  const handleCreateItem = () => {
    if (!formData.title || !formData.type) return;

    const newItem: KnowledgeItem = {
      id: `kb-${Date.now()}`,
      title: formData.title,
      type: formData.type,
      content: formData.content,
      url: formData.url,
      tags: formData.tags || [],
      category: formData.category,
      summary: formData.summary,
      createdAt: new Date().toISOString(),
    };

    setItems([...items, newItem]);
    setFormData({});
    setIsDialogOpen(false);
  };

  const handleDeleteItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  const types = Array.from(new Set(items.map(i => i.type))) as KnowledgeItem['type'][];
  const categories = Array.from(new Set(items.map(i => i.category).filter(Boolean)));

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.summary?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = !selectedType || item.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="flex h-full flex-col space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Knowledge Library</h1>
          <p className="text-muted-foreground">
            Store and organize brand documents, SOPs, playbooks, and medical references.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add to Knowledge Library</DialogTitle>
              <DialogDescription>
                Add documents, SOPs, playbooks, or references to your knowledge base.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Patient Communication Guidelines"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Type</Label>
                  <select
                    id="type"
                    value={formData.type || ''}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full px-3 py-2 border border-input rounded-md"
                  >
                    <option value="">Select type...</option>
                    {Object.entries(typeConfig).map(([key, value]) => (
                      <option key={key} value={key}>{value.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    placeholder="e.g., Marketing"
                    value={formData.category || ''}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="summary">Summary</Label>
                <Textarea
                  id="summary"
                  placeholder="Brief description of this item..."
                  value={formData.summary || ''}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  placeholder="Paste content here or provide a URL below..."
                  value={formData.content || ''}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="url">URL (optional)</Label>
                <Input
                  id="url"
                  placeholder="https://example.com"
                  value={formData.url || ''}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Textarea
                  id="tags"
                  placeholder="e.g., marketing, social-media, compliance"
                  value={(formData.tags || []).join(', ')}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(',').map(t => t.trim()) })}
                  rows={2}
                />
              </div>

              <Button onClick={handleCreateItem} className="w-full">
                Add to Library
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search & Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search knowledge library..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div>
          <Label className="text-xs text-muted-foreground mb-2 block">Filter by Type</Label>
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
      </div>

      {/* Items List */}
      <ScrollArea className="flex-1 pr-4">
        <div className="space-y-3">
          {filteredItems.map((item) => (
            <Card key={item.id} className="hover:border-primary/50 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{typeConfig[item.type].icon}</span>
                      <CardTitle className="text-base">{item.title}</CardTitle>
                    </div>
                    <div className="flex gap-2 items-center flex-wrap">
                      <Badge className={typeConfig[item.type].color}>
                        {typeConfig[item.type].label}
                      </Badge>
                      {item.category && (
                        <Badge variant="outline" className="text-xs">
                          {item.category}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => handleDeleteItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {item.summary && (
                  <p className="text-sm text-muted-foreground">{item.summary}</p>
                )}

                {item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {item.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                  <span>Added {new Date(item.createdAt).toLocaleDateString()}</span>
                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center gap-1"
                    >
                      <LinkIcon className="h-3 w-3" />
                      View
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
