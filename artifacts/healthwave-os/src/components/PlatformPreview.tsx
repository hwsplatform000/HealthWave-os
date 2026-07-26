import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlatformIcon } from '@/components/PlatformIcon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Smartphone, Monitor } from 'lucide-react';

export interface PlatformPreviewData {
  platform: string;
  profile?: string;
  profileImage?: string;
  caption: string;
  hashtags?: string[];
  cta?: string;
  image?: string;
  characterCount: number;
  characterLimit: number;
}

interface PlatformPreviewProps {
  data: PlatformPreviewData;
}

export default function PlatformPreview({ data }: PlatformPreviewProps) {
  const characterPercentage = (data.characterCount / data.characterLimit) * 100;
  const isOverLimit = data.characterCount > data.characterLimit;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <PlatformIcon platform={data.platform} className="h-4 w-4" />
            {data.platform.replace('_', ' ')} Preview
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            {data.characterCount}/{data.characterLimit}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Character Count Bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Character Count</span>
            <span className={isOverLimit ? 'text-hw-red font-semibold' : 'text-muted-foreground'}>
              {data.characterCount}/{data.characterLimit}
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
            <div
              className={`h-full transition-all ${isOverLimit ? 'bg-hw-red' : characterPercentage > 80 ? 'bg-hw-yellow' : 'bg-hw-green'}`}
              style={{ width: `${Math.min(characterPercentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Device Preview Tabs */}
        <Tabs defaultValue="mobile" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="mobile" className="gap-2">
              <Smartphone className="h-4 w-4" />
              Mobile
            </TabsTrigger>
            <TabsTrigger value="desktop" className="gap-2">
              <Monitor className="h-4 w-4" />
              Desktop
            </TabsTrigger>
          </TabsList>

          <TabsContent value="mobile" className="mt-4">
            <div className="border rounded-lg p-4 bg-card/50 space-y-3 max-w-sm mx-auto">
              {/* Profile Section */}
              {data.profile && (
                <div className="flex items-center gap-2">
                  {data.profileImage && (
                    <img src={data.profileImage} alt="Profile" className="h-8 w-8 rounded-full bg-secondary" />
                  )}
                  <div className="flex-1">
                    <p className="text-xs font-semibold">{data.profile}</p>
                    <p className="text-[10px] text-muted-foreground">Healthcare Brand</p>
                  </div>
                </div>
              )}

              {/* Image Preview */}
              {data.image && (
                <div className="w-full h-32 bg-secondary rounded-lg flex items-center justify-center text-xs text-muted-foreground">
                  [Image Preview]
                </div>
              )}

              {/* Caption */}
              <div className="space-y-1">
                <p className="text-xs leading-relaxed text-foreground">{data.caption}</p>
              </div>

              {/* Hashtags */}
              {data.hashtags && data.hashtags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {data.hashtags.map((tag, i) => (
                    <span key={i} className="text-xs text-primary">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* CTA */}
              {data.cta && (
                <button className="w-full px-3 py-2 bg-primary text-primary-foreground rounded text-xs font-semibold">
                  {data.cta}
                </button>
              )}

              {/* Engagement Preview */}
              <div className="flex justify-around pt-2 border-t text-[10px] text-muted-foreground">
                <span>👍 Like</span>
                <span>💬 Comment</span>
                <span>↗️ Share</span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="desktop" className="mt-4">
            <div className="border rounded-lg p-6 bg-card/50 space-y-4 max-w-2xl">
              {/* Profile Section */}
              {data.profile && (
                <div className="flex items-center gap-3">
                  {data.profileImage && (
                    <img src={data.profileImage} alt="Profile" className="h-10 w-10 rounded-full bg-secondary" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{data.profile}</p>
                    <p className="text-xs text-muted-foreground">Healthcare Brand</p>
                  </div>
                </div>
              )}

              {/* Image Preview */}
              {data.image && (
                <div className="w-full h-48 bg-secondary rounded-lg flex items-center justify-center text-sm text-muted-foreground">
                  [Image Preview]
                </div>
              )}

              {/* Caption */}
              <div className="space-y-2">
                <p className="text-sm leading-relaxed text-foreground">{data.caption}</p>
              </div>

              {/* Hashtags */}
              {data.hashtags && data.hashtags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {data.hashtags.map((tag, i) => (
                    <span key={i} className="text-sm text-primary">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* CTA */}
              {data.cta && (
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded text-sm font-semibold">
                  {data.cta}
                </button>
              )}

              {/* Engagement Preview */}
              <div className="flex gap-4 pt-3 border-t text-xs text-muted-foreground">
                <span>👍 Like</span>
                <span>💬 Comment</span>
                <span>↗️ Share</span>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
