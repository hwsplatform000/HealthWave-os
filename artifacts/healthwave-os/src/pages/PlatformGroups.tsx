import { useState } from 'react';
import { useListPlatforms } from '@workspace/api-client-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PlatformIcon } from '@/components/PlatformIcon';
import { Plus, Trash2, Edit2, Copy } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface PlatformGroup {
  id: string;
  name: string;
  description: string;
  platforms: string[];
  isDefault: boolean;
}

const defaultGroups: PlatformGroup[] = [
  {
    id: 'all',
    name: 'All Platforms',
    description: 'Publish to all connected platforms',
    platforms: ['facebook', 'instagram', 'linkedin', 'twitter', 'tiktok', 'youtube'],
    isDefault: true,
  },
  {
    id: 'social',
    name: 'All Social',
    description: 'Major social media platforms',
    platforms: ['facebook', 'instagram', 'linkedin', 'twitter', 'tiktok'],
    isDefault: true,
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Professional networks and blogs',
    platforms: ['linkedin', 'blog'],
    isDefault: true,
  },
  {
    id: 'video',
    name: 'Video',
    description: 'Video-focused platforms',
    platforms: ['tiktok', 'youtube'],
    isDefault: true,
  },
  {
    id: 'local',
    name: 'Local Marketing',
    description: 'Local business platforms',
    platforms: ['google_business', 'facebook'],
    isDefault: true,
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    description: 'Healthcare-focused platforms',
    platforms: ['linkedin', 'facebook', 'instagram'],
    isDefault: true,
  },
];

const allPlatforms = [
  'facebook',
  'instagram',
  'linkedin',
  'tiktok',
  'youtube',
  'twitter',
  'google_business',
  'pinterest',
  'threads',
  'snapchat',
  'reddit',
  'tumblr',
  'medium',
  'wordpress',
  'discord',
  'telegram',
];

export default function PlatformGroups() {
  const [groups, setGroups] = useState<PlatformGroup[]>(defaultGroups);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const { data: platformsData } = useListPlatforms();

  const handleCreateGroup = () => {
    if (newGroupName && selectedPlatforms.length > 0) {
      const newGroup: PlatformGroup = {
        id: `group-${Date.now()}`,
        name: newGroupName,
        description: newGroupDescription,
        platforms: selectedPlatforms,
        isDefault: false,
      };
      setGroups([...groups, newGroup]);
      setNewGroupName('');
      setNewGroupDescription('');
      setSelectedPlatforms([]);
      setIsDialogOpen(false);
    }
  };

  const deleteGroup = (id: string) => {
    setGroups(groups.filter(g => g.id !== id));
  };

  const duplicateGroup = (group: PlatformGroup) => {
    const newGroup: PlatformGroup = {
      ...group,
      id: `group-${Date.now()}`,
      name: `${group.name} (Copy)`,
      isDefault: false,
    };
    setGroups([...groups, newGroup]);
  };

  return (
    <div className="flex h-full flex-col space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Platform Groups</h1>
          <p className="text-muted-foreground">
            Create reusable groups to publish to multiple platforms at once.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Group
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Platform Group</DialogTitle>
              <DialogDescription>
                Group platforms together to publish to multiple platforms at once.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="group-name">Group Name</Label>
                <Input
                  id="group-name"
                  placeholder="e.g., Weekend Marketing"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="group-desc">Description</Label>
                <Input
                  id="group-desc"
                  placeholder="Describe this group's purpose"
                  value={newGroupDescription}
                  onChange={(e) => setNewGroupDescription(e.target.value)}
                />
              </div>
              <div>
                <Label>Select Platforms</Label>
                <div className="grid grid-cols-2 gap-3 mt-3 p-3 border rounded-lg bg-card/50">
                  {allPlatforms.map((platform) => (
                    <div key={platform} className="flex items-center space-x-2">
                      <Checkbox
                        id={`platform-${platform}`}
                        checked={selectedPlatforms.includes(platform)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedPlatforms([...selectedPlatforms, platform]);
                          } else {
                            setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform));
                          }
                        }}
                      />
                      <label
                        htmlFor={`platform-${platform}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex items-center gap-2"
                      >
                        <PlatformIcon platform={platform} className="h-4 w-4" />
                        {platform.replace('_', ' ')}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <Button onClick={handleCreateGroup} className="w-full">
                Create Group
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Groups Grid */}
      <ScrollArea className="flex-1 pr-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <Card key={group.id} className="flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-base">{group.name}</CardTitle>
                      {group.isDefault && (
                        <Badge variant="secondary" className="text-[10px]">Default</Badge>
                      )}
                    </div>
                    <CardDescription className="mt-1 text-xs">{group.description}</CardDescription>
                  </div>
                  {!group.isDefault && (
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => duplicateGroup(group)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => deleteGroup(group.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="flex flex-wrap gap-2">
                  {group.platforms.map((platform) => (
                    <Badge key={platform} variant="outline" className="text-xs flex items-center gap-1">
                      <PlatformIcon platform={platform} className="h-3 w-3" />
                      {platform.replace('_', ' ')}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
