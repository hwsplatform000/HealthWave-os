import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Settings, Trash2, Edit2, Clock, Shield, AlertCircle, CheckCircle2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface PublishingRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  type: 'approval' | 'compliance' | 'timing' | 'content' | 'platform';
  conditions: string[];
}

const defaultRules: PublishingRule[] = [
  {
    id: '1',
    name: 'Approval Required',
    description: 'All posts require manager approval before publishing',
    enabled: true,
    type: 'approval',
    conditions: ['All platforms', 'All content types'],
  },
  {
    id: '2',
    name: 'Compliance Review',
    description: 'Healthcare content must pass compliance review',
    enabled: true,
    type: 'compliance',
    conditions: ['Medical claims', 'Health advice'],
  },
  {
    id: '3',
    name: 'Quiet Hours',
    description: 'No posts between 11 PM and 7 AM',
    enabled: true,
    type: 'timing',
    conditions: ['All platforms'],
  },
  {
    id: '4',
    name: 'Daily Post Limit',
    description: 'Maximum 10 posts per platform per day',
    enabled: true,
    type: 'content',
    conditions: ['All platforms'],
  },
];

export default function PublishingRules() {
  const [rules, setRules] = useState<PublishingRule[]>(defaultRules);
  const [editingRule, setEditingRule] = useState<PublishingRule | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const toggleRule = (id: string) => {
    setRules(rules.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };

  const deleteRule = (id: string) => {
    setRules(rules.filter(r => r.id !== id));
  };

  const getRuleIcon = (type: PublishingRule['type']) => {
    switch (type) {
      case 'approval':
        return <CheckCircle2 className="h-4 w-4 text-hw-green" />;
      case 'compliance':
        return <Shield className="h-4 w-4 text-hw-yellow" />;
      case 'timing':
        return <Clock className="h-4 w-4 text-hw-cyan" />;
      case 'content':
        return <AlertCircle className="h-4 w-4 text-hw-blue" />;
      case 'platform':
        return <Settings className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getRuleTypeLabel = (type: PublishingRule['type']) => {
    const labels: Record<PublishingRule['type'], string> = {
      approval: 'Approval',
      compliance: 'Compliance',
      timing: 'Timing',
      content: 'Content',
      platform: 'Platform',
    };
    return labels[type];
  };

  return (
    <div className="flex h-full flex-col space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Publishing Rules</h1>
          <p className="text-muted-foreground">
            Configure publishing policies and approval workflows.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Rule
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Publishing Rule</DialogTitle>
              <DialogDescription>
                Define a new rule to control how content is published.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="rule-name">Rule Name</Label>
                <Input id="rule-name" placeholder="e.g., Video Approval Required" />
              </div>
              <div>
                <Label htmlFor="rule-desc">Description</Label>
                <Input id="rule-desc" placeholder="Describe what this rule does" />
              </div>
              <Button className="w-full">Create Rule</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All Rules</TabsTrigger>
          <TabsTrigger value="approval">Approval</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="timing">Timing</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="flex-1 space-y-4">
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-3">
              {rules.map((rule) => (
                <Card key={rule.id} className={rule.enabled ? '' : 'opacity-60'}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="mt-1">
                          {getRuleIcon(rule.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-base">{rule.name}</CardTitle>
                            <Badge variant="outline" className="text-xs">
                              {getRuleTypeLabel(rule.type)}
                            </Badge>
                          </div>
                          <CardDescription className="mt-1">{rule.description}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch checked={rule.enabled} onCheckedChange={() => toggleRule(rule.id)} />
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => deleteRule(rule.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {rule.conditions.map((condition, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {condition}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="approval" className="flex-1 space-y-4">
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-3">
              {rules.filter(r => r.type === 'approval').map((rule) => (
                <Card key={rule.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <CheckCircle2 className="h-4 w-4 text-hw-green mt-1" />
                        <div className="flex-1">
                          <CardTitle className="text-base">{rule.name}</CardTitle>
                          <CardDescription className="mt-1">{rule.description}</CardDescription>
                        </div>
                      </div>
                      <Switch checked={rule.enabled} onCheckedChange={() => toggleRule(rule.id)} />
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="compliance" className="flex-1 space-y-4">
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-3">
              {rules.filter(r => r.type === 'compliance').map((rule) => (
                <Card key={rule.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <Shield className="h-4 w-4 text-hw-yellow mt-1" />
                        <div className="flex-1">
                          <CardTitle className="text-base">{rule.name}</CardTitle>
                          <CardDescription className="mt-1">{rule.description}</CardDescription>
                        </div>
                      </div>
                      <Switch checked={rule.enabled} onCheckedChange={() => toggleRule(rule.id)} />
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="timing" className="flex-1 space-y-4">
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-3">
              {rules.filter(r => r.type === 'timing').map((rule) => (
                <Card key={rule.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <Clock className="h-4 w-4 text-hw-cyan mt-1" />
                        <div className="flex-1">
                          <CardTitle className="text-base">{rule.name}</CardTitle>
                          <CardDescription className="mt-1">{rule.description}</CardDescription>
                        </div>
                      </div>
                      <Switch checked={rule.enabled} onCheckedChange={() => toggleRule(rule.id)} />
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="content" className="flex-1 space-y-4">
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-3">
              {rules.filter(r => r.type === 'content').map((rule) => (
                <Card key={rule.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <AlertCircle className="h-4 w-4 text-hw-blue mt-1" />
                        <div className="flex-1">
                          <CardTitle className="text-base">{rule.name}</CardTitle>
                          <CardDescription className="mt-1">{rule.description}</CardDescription>
                        </div>
                      </div>
                      <Switch checked={rule.enabled} onCheckedChange={() => toggleRule(rule.id)} />
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
