import { useGetPublishingQueue, useGetScheduledPosts, usePauseQueueItem, useResumeQueueItem, useReorderQueueItem } from '@workspace/api-client-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { StatusBadge } from '@/components/StatusBadge';
import { PlatformIcon } from '@/components/PlatformIcon';
import { format, parseISO, isToday, isTomorrow, addDays } from 'date-fns';
import { Calendar as CalendarIcon, Clock, MoreVertical, PauseCircle, PlayCircle, Settings, GripVertical } from 'lucide-react';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Scheduler() {
  const { data: queueData, isLoading: queueLoading } = useGetPublishingQueue();
  const { data: scheduledData, isLoading: scheduledLoading } = useGetScheduledPosts({ 
    start: new Date().toISOString(), 
    end: addDays(new Date(), 7).toISOString() 
  });

  const pauseItem = usePauseQueueItem();
  const resumeItem = useResumeQueueItem();
  const reorderItem = useReorderQueueItem();

  const handlePause = (id: string, isPaused: boolean) => {
    if (isPaused) {
      resumeItem.mutate({ id }, { onSuccess: () => toast.success('Post resumed') });
    } else {
      pauseItem.mutate({ id }, { onSuccess: () => toast.success('Post paused') });
    }
  };

  const isPaused = (status: string) => status === 'paused';

  const groupedScheduled = scheduledData?.items?.reduce((acc, item) => {
    const date = parseISO(item.scheduledFor);
    let key = format(date, 'MMM d, yyyy');
    if (isToday(date)) key = 'Today';
    else if (isTomorrow(date)) key = 'Tomorrow';

    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {} as Record<string, typeof scheduledData.items>) || {};

  return (
    <div className="flex h-full flex-col space-y-6 p-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Scheduler</h1>
          <p className="text-muted-foreground">
            Manage your publishing queue and scheduled content.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Settings className="h-4 w-4" />
            Queue Settings
          </Button>
          <Button className="gap-2">
            <Clock className="h-4 w-4" />
            Schedule Post
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column - Active Queue */}
        <Card className="flex flex-col h-[calc(100vh-12rem)]">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Active Queue</CardTitle>
                <CardDescription>
                  {queueData?.paused ? 'Queue is currently paused' : 'Posts waiting to be published'}
                </CardDescription>
              </div>
              <Button 
                variant={queueData?.paused ? 'default' : 'outline'} 
                size="sm"
                className="gap-2"
                onClick={() => toast.info(queueData?.paused ? 'Resuming global queue...' : 'Pausing global queue...')}
              >
                {queueData?.paused ? <PlayCircle className="h-4 w-4" /> : <PauseCircle className="h-4 w-4" />}
                {queueData?.paused ? 'Resume Queue' : 'Pause Queue'}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-0">
            <ScrollArea className="h-full">
              <div className="p-4 space-y-3">
                {queueLoading ? (
                  <p className="text-center text-muted-foreground p-4">Loading queue...</p>
                ) : queueData?.items.length === 0 ? (
                  <p className="text-center text-muted-foreground p-4">Queue is empty.</p>
                ) : (
                  queueData?.items.map((item) => (
                    <div 
                      key={item.id} 
                      className={`group flex items-center gap-3 rounded-lg border bg-card p-3 transition-colors ${
                        isPaused(item.status) ? 'opacity-60' : 'hover:border-primary/50'
                      }`}
                    >
                      <button className="cursor-grab text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                        <GripVertical className="h-5 w-5" />
                      </button>
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-secondary">
                        <PlatformIcon platform={item.platform} className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{item.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <StatusBadge status={item.status} />
                          {item.campaign && (
                            <span className="text-xs text-muted-foreground border-l border-border pl-2">
                              Campaign: {item.campaign}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-xs font-medium text-muted-foreground">
                          {format(parseISO(item.scheduledFor), 'h:mm a')}
                        </span>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Edit Content</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handlePause(item.id, isPaused(item.status))}>
                              {isPaused(item.status) ? 'Resume' : 'Pause'}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">Remove from Queue</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Right Column - Upcoming Timeline */}
        <Card className="flex flex-col h-[calc(100vh-12rem)]">
          <CardHeader className="border-b">
            <CardTitle>Upcoming Schedule</CardTitle>
            <CardDescription>Locked-in scheduled posts</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 p-0">
            <ScrollArea className="h-full">
              <div className="p-6 space-y-8">
                {scheduledLoading ? (
                  <p className="text-center text-muted-foreground p-4">Loading schedule...</p>
                ) : Object.keys(groupedScheduled).length === 0 ? (
                  <div className="text-center p-8 border border-dashed rounded-lg">
                    <CalendarIcon className="mx-auto h-8 w-8 text-muted-foreground mb-3" />
                    <p className="font-medium">No upcoming scheduled posts</p>
                    <p className="text-sm text-muted-foreground mt-1">Your timeline is empty for the next 7 days.</p>
                  </div>
                ) : (
                  Object.entries(groupedScheduled).map(([day, posts]) => (
                    <div key={day} className="space-y-4">
                      <h3 className="font-semibold text-sm tracking-wider text-muted-foreground uppercase flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4" />
                        {day}
                      </h3>
                      <div className="space-y-4 border-l-2 border-border ml-2 pl-4">
                        {posts.map((post) => (
                          <div key={post.id} className="relative">
                            <div className="absolute -left-[21px] top-2 h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-background" />
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 rounded-lg border bg-card p-3 hover:bg-accent/50 transition-colors">
                              <div className="flex gap-3">
                                <PlatformIcon platform={post.platform} className="h-5 w-5 mt-0.5" />
                                <div>
                                  <p className="font-medium text-sm leading-tight">{post.title}</p>
                                  <div className="flex items-center gap-2 mt-2">
                                    <StatusBadge status={post.status} />
                                    {post.recurring && (
                                      <span className="text-xs bg-secondary px-1.5 py-0.5 rounded text-muted-foreground">
                                        Recurring
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="text-right shrink-0">
                                <p className="text-sm font-semibold">{format(parseISO(post.scheduledFor), 'h:mm a')}</p>
                                <p className="text-xs text-muted-foreground">{post.timezone}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
