import { useGetPublishingQueue, useGetScheduledPosts, useListPlatforms, useGetPublishingHistory } from '@workspace/api-client-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { StatusBadge } from '@/components/StatusBadge';
import { PlatformIcon } from '@/components/PlatformIcon';
import { Badge } from '@/components/ui/badge';
import { format, parseISO, addDays } from 'date-fns';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Zap,
  TrendingUp,
  AlertCircle,
  Wifi,
  Plus,
  Settings,
  MoreVertical,
} from 'lucide-react';
import { Link } from 'wouter';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function PublishingDashboard() {
  const { data: queueData, isLoading: queueLoading } = useGetPublishingQueue();
  const { data: scheduledData, isLoading: scheduledLoading } = useGetScheduledPosts({
    start: new Date().toISOString(),
    end: addDays(new Date(), 7).toISOString()
  });
  const { data: platformsData, isLoading: platformsLoading } = useListPlatforms();
  const { data: historyData, isLoading: historyLoading } = useGetPublishingHistory({ limit: 5 });

  const failedPosts = historyData?.items?.filter(item => item.status === 'failed') || [];
  const successfulPosts = historyData?.items?.filter(item => item.status === 'published') || [];

  return (
    <div className="flex h-full flex-col space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Publishing Dashboard</h1>
          <p className="text-muted-foreground">
            Command center for scheduling, organizing, and distributing content.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Settings className="h-4 w-4" />
            Rules
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Post
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Queue Size</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{queueLoading ? '-' : queueData?.items.length || 0}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Posts waiting
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scheduledLoading ? '-' : scheduledData?.items.length || 0}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-emerald-500" />
              Next 7 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Failed Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-hw-red">{failedPosts.length}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <AlertTriangle className="h-3 w-3 text-hw-red" />
              Action needed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Connected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {platformsLoading ? '-' : `${platformsData?.items.filter(p => p.status === 'active').length || 0}/${platformsData?.items.length || 0}`}
            </div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <Wifi className="h-3 w-3 text-hw-cyan" />
              Platforms
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Queue & Scheduled */}
        <div className="flex flex-col space-y-6 lg:col-span-2">
          {/* Live Publishing Queue */}
          <Card className="flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Live Publishing Queue</CardTitle>
                <CardDescription>Posts waiting to be published</CardDescription>
              </div>
              <Button asChild variant="ghost" size="sm" className="gap-1">
                <Link href="/scheduler">
                  View All <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="flex-1">
              <ScrollArea className="h-[300px] pr-4">
                {queueLoading ? (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    Loading queue...
                  </div>
                ) : queueData?.items.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center space-y-3 rounded-lg border border-dashed p-8 text-center">
                    <Zap className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Queue is empty</p>
                      <p className="text-sm text-muted-foreground">All posts have been published.</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {queueData?.items.slice(0, 5).map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between rounded-lg border bg-card p-3 transition-colors hover:bg-accent/50"
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5">
                            <PlatformIcon platform={item.platform} className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{item.title}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <StatusBadge status={item.status} />
                              <span className="text-xs text-muted-foreground">
                                {format(parseISO(item.scheduledFor), 'h:mm a')}
                              </span>
                            </div>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Pause</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">Remove</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Upcoming Scheduled Posts */}
          <Card className="flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Upcoming Scheduled Posts</CardTitle>
                <CardDescription>Next 7 days</CardDescription>
              </div>
              <Button asChild variant="ghost" size="sm" className="gap-1">
                <Link href="/calendar">
                  Calendar <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px] pr-4">
                {scheduledLoading ? (
                  <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
                    Loading schedule...
                  </div>
                ) : scheduledData?.items.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center space-y-2 text-center">
                    <Clock className="h-6 w-6 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">No scheduled posts</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {scheduledData?.items.map((post) => (
                      <div key={post.id} className="flex items-center justify-between rounded-lg border bg-card/50 p-2">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <PlatformIcon platform={post.platform} className="h-4 w-4 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium truncate">{post.title}</p>
                            <p className="text-[10px] text-muted-foreground">{format(parseISO(post.scheduledFor), 'MMM d, h:mm a')}</p>
                          </div>
                        </div>
                        <StatusBadge status={post.status} />
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Platform Status & Failed Posts */}
        <div className="flex flex-col space-y-6">
          {/* Platform Connection Status */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold">Platform Status</CardTitle>
              <Button asChild variant="ghost" size="sm" className="h-8 px-2 text-xs">
                <Link href="/platforms">Manage</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {platformsLoading ? (
                  <div className="text-sm text-muted-foreground">Loading...</div>
                ) : platformsData?.items.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No platforms connected</p>
                ) : (
                  platformsData?.items.slice(0, 6).map((platform) => (
                    <div key={platform.id} className="flex items-center justify-between p-2 rounded-lg border bg-card/50">
                      <div className="flex items-center gap-2">
                        <PlatformIcon platform={platform.platform} className="h-4 w-4" />
                        <span className="text-xs font-medium capitalize">{platform.platform.replace('_', ' ')}</span>
                      </div>
                      <Badge variant={platform.status === 'active' ? 'default' : 'secondary'} className="text-[10px]">
                        {platform.status === 'active' ? 'Connected' : 'Disconnected'}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Failed Posts */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold">Failed Posts</CardTitle>
              {failedPosts.length > 0 && (
                <Badge variant="destructive" className="text-[10px]">{failedPosts.length}</Badge>
              )}
            </CardHeader>
            <CardContent>
              {failedPosts.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-4 text-center">
                  <CheckCircle2 className="h-8 w-8 text-hw-green mb-2" />
                  <p className="text-xs text-muted-foreground">All posts published successfully</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {failedPosts.map((post) => (
                    <div key={post.id} className="flex flex-col gap-2 rounded-lg border border-hw-red/20 bg-hw-red/5 p-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">{post.title}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">{post.platform}</p>
                        </div>
                        <AlertCircle className="h-4 w-4 text-hw-red shrink-0 mt-0.5" />
                      </div>
                      {post.error && (
                        <p className="text-[10px] text-hw-red line-clamp-2">{post.error}</p>
                      )}
                      <Button size="sm" variant="outline" className="h-6 text-xs w-full">
                        Retry
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI Recommendations */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="flex items-start gap-3 p-4">
              <div className="rounded-full bg-primary/20 p-2 shrink-0">
                <Zap className="h-4 w-4 text-primary" />
              </div>
              <div className="space-y-1 flex-1">
                <h4 className="text-xs font-semibold text-primary">AI Recommendation</h4>
                <p className="text-xs text-muted-foreground">
                  Best posting time for your audience is 9 AM EST on weekdays.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
