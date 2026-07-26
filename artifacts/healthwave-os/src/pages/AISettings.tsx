import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Settings, Zap, Lock, Eye, EyeOff } from 'lucide-react';
import { PROVIDER_CONFIG, type AIProvider } from '@workspace/api-server/lib/ai-providers';

interface AISettings {
  defaultProvider: AIProvider;
  defaultModel: string;
  temperature: number;
  maxOutputLength: number;
  creativityLevel: number;
  medicalAccuracyPreference: 'standard' | 'high' | 'strict';
  writingStyle: string;
  enableWebSearch: boolean;
  enableReasoning: boolean;
}

export default function AISettingsPage() {
  const [settings, setSettings] = useState<AISettings>({
    defaultProvider: 'gemini',
    defaultModel: 'gemini-1.5-pro',
    temperature: 0.7,
    maxOutputLength: 2048,
    creativityLevel: 5,
    medicalAccuracyPreference: 'high',
    writingStyle: 'professional',
    enableWebSearch: true,
    enableReasoning: false,
  });

  const [apiKeys, setApiKeys] = useState<Record<AIProvider, string>>({
    gemini: '',
    openai: '',
    claude: '',
    grok: '',
    perplexity: '',
    openrouter: '',
  });

  const [visibleKeys, setVisibleKeys] = useState<Record<AIProvider, boolean>>({
    gemini: false,
    openai: false,
    claude: false,
    grok: false,
    perplexity: false,
    openrouter: false,
  });

  const [isSaving, setIsSaving] = useState(false);

  const currentProvider = PROVIDER_CONFIG[settings.defaultProvider];
  const availableModels = currentProvider.models;

  const handleProviderChange = (provider: AIProvider) => {
    setSettings({
      ...settings,
      defaultProvider: provider,
      defaultModel: PROVIDER_CONFIG[provider].defaultModel,
    });
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      // API call would go here
      console.log('Saving settings:', settings);
      // await fetch('/api/ai-settings', { method: 'PUT', body: JSON.stringify(settings) })
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex h-full flex-col space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Settings</h1>
          <p className="text-muted-foreground">
            Configure AI providers, models, and generation parameters.
          </p>
        </div>
        <Button onClick={handleSaveSettings} disabled={isSaving} className="gap-2">
          <Zap className="h-4 w-4" />
          {isSaving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="general" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="generation">Generation</TabsTrigger>
          <TabsTrigger value="providers">Providers</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        {/* General Tab */}
        <TabsContent value="general" className="flex-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Default Provider & Model</CardTitle>
              <CardDescription>
                Choose your primary AI provider and model for content generation.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="provider">AI Provider</Label>
                <Select value={settings.defaultProvider} onValueChange={handleProviderChange}>
                  <SelectTrigger id="provider" className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(PROVIDER_CONFIG).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        {config.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="model">Model</Label>
                <Select value={settings.defaultModel} onValueChange={(model) => setSettings({ ...settings, defaultModel: model })}>
                  <SelectTrigger id="model" className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableModels.map((model) => (
                      <SelectItem key={model} value={model}>
                        {model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                <p className="text-xs text-muted-foreground">
                  <strong>{currentProvider.name}</strong> supports reasoning: <strong>{currentProvider.supportsReasoning ? 'Yes' : 'No'}</strong>
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Writing Style & Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="style">Writing Style</Label>
                <Select value={settings.writingStyle} onValueChange={(style) => setSettings({ ...settings, writingStyle: style })}>
                  <SelectTrigger id="style" className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="conversational">Conversational</SelectItem>
                    <SelectItem value="academic">Academic</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="accuracy">Medical Accuracy Preference</Label>
                <Select value={settings.medicalAccuracyPreference} onValueChange={(pref) => setSettings({ ...settings, medicalAccuracyPreference: pref as any })}>
                  <SelectTrigger id="accuracy" className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="strict">Strict (FDA/HIPAA Compliant)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Generation Tab */}
        <TabsContent value="generation" className="flex-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Generation Parameters</CardTitle>
              <CardDescription>
                Fine-tune how AI generates content.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Temperature: {settings.temperature.toFixed(2)}</Label>
                  <span className="text-xs text-muted-foreground">Creativity vs Consistency</span>
                </div>
                <Slider
                  value={[settings.temperature]}
                  onValueChange={(value) => setSettings({ ...settings, temperature: value[0] })}
                  min={0}
                  max={2}
                  step={0.1}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Lower values (0-0.5) = More focused, Higher values (1.5-2) = More creative
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Creativity Level: {settings.creativityLevel}/10</Label>
                </div>
                <Slider
                  value={[settings.creativityLevel]}
                  onValueChange={(value) => setSettings({ ...settings, creativityLevel: value[0] })}
                  min={1}
                  max={10}
                  step={1}
                  className="w-full"
                />
              </div>

              <div>
                <Label htmlFor="maxLength">Maximum Output Length</Label>
                <Input
                  id="maxLength"
                  type="number"
                  value={settings.maxOutputLength}
                  onChange={(e) => setSettings({ ...settings, maxOutputLength: parseInt(e.target.value) })}
                  min={100}
                  max={32000}
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Characters: {settings.maxOutputLength}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Providers Tab */}
        <TabsContent value="providers" className="flex-1 space-y-4">
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              {Object.entries(PROVIDER_CONFIG).map(([key, config]) => (
                <Card key={key}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base">{config.name}</CardTitle>
                        <CardDescription className="mt-1">
                          {config.models.length} models available
                        </CardDescription>
                      </div>
                      <Badge variant={settings.defaultProvider === key ? 'default' : 'outline'}>
                        {settings.defaultProvider === key ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label htmlFor={`key-${key}`} className="text-xs">API Key</Label>
                      <div className="flex gap-2 mt-2">
                        <Input
                          id={`key-${key}`}
                          type={visibleKeys[key as AIProvider] ? 'text' : 'password'}
                          placeholder="Enter API key"
                          value={apiKeys[key as AIProvider]}
                          onChange={(e) => setApiKeys({ ...apiKeys, [key]: e.target.value })}
                          className="flex-1"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setVisibleKeys({ ...visibleKeys, [key]: !visibleKeys[key as AIProvider] })}
                        >
                          {visibleKeys[key as AIProvider] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Lock className="h-3 w-3" />
                      <span>API keys are encrypted and stored securely</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Advanced Tab */}
        <TabsContent value="advanced" className="flex-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium text-sm">Web Search</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Allow AI to search the web for current information
                  </p>
                </div>
                <Switch
                  checked={settings.enableWebSearch}
                  onCheckedChange={(checked) => setSettings({ ...settings, enableWebSearch: checked })}
                />
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium text-sm">Reasoning Mode</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Enable extended reasoning (available on select models)
                  </p>
                </div>
                <Switch
                  checked={settings.enableReasoning}
                  onCheckedChange={(checked) => setSettings({ ...settings, enableReasoning: checked })}
                  disabled={!currentProvider.supportsReasoning}
                />
              </div>

              {!currentProvider.supportsReasoning && (
                <div className="p-3 rounded-lg bg-muted/50 border">
                  <p className="text-xs text-muted-foreground">
                    <strong>{currentProvider.name}</strong> does not support reasoning mode. Switch to a provider that supports it to enable this feature.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
