import { useListCampaigns } from '@workspace/api-client-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { StatusBadge } from '@/components/StatusBadge';
import { PlatformIcon } from '@/components/PlatformIcon';
import { Plus, Target, Megaphone, Calendar } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export default function Campaigns() {
  const { data, isLoading } = useListCampaigns();

  return (
    <div className="flex h-full flex-col space-y-6 p-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Campaigns</h1>
          <p className="text-muted-foreground">
            Track and manage your multi-platform marketing initiatives.
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Campaign
        </Button>
      </div>

      <ScrollArea className="flex-1 -mx-6 px-6">
        <div className="space-y-4 pb-8">
          {isLoading ? (
            <p className="text-muted-foreground">Loading campaigns...</p>
          ) : data?.items?.length === 0 ? (
            <div className="text-center p-12 border border-dashed rounded-lg">
              <Megaphone className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-lg font-medium">No Campaigns</h3>
              <p className="text-muted-foreground">Create your first campaign to group content.</p>
            </div>
          ) : (
            data?.items?.map((campaign) => (
              <Card key={campaign.id} className="overflow-hidden hover:border-primary/50 transition-colors">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    <div className="flex-1 p-6 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h2 className="text-xl font-bold">{campaign.name}</h2>
                            <StatusBadge status={campaign.status} className="scale-90" />
                          </div>
                          <p className="text-sm text-muted-foreground font-medium">{campaign.type}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Target className="h-4 w-4 text-muted-foreground" />
                          <span className="text-foreground">{campaign.goal}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-foreground">
                            {campaign.startDate ? format(parseISO(campaign.startDate), 'MMM d') : '?'} 
                            {' - '} 
                            {campaign.endDate ? format(parseISO(campaign.endDate), 'MMM d, yyyy') : '?'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-muted/20 p-6 md:w-1/3 border-t md:border-t-0 md:border-l flex flex-col justify-center space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="font-medium">Progress</span>
                          <span className="text-muted-foreground">{campaign.progress}%</span>
                        </div>
                        <Progress value={campaign.progress} className="h-2" />
                      </div>
                      
                      <div className="flex justify-between items-center pt-2">
                        <div className="flex -space-x-1">
                          {campaign.platforms.map(p => (
                            <div key={p} className="h-6 w-6 rounded-full bg-background border flex items-center justify-center">
                              <PlatformIcon platform={p} className="h-3 w-3" />
                            </div>
                          ))}
                        </div>
                        <Button variant="secondary" size="sm">Manage</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
