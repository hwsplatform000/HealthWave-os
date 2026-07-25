import { useGetDashboardSummary, useGetRecentActivity, useGetPublishingQueue } from '@workspace/api-client-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { StatusBadge } from '@/components/StatusBadge';
import { PlatformIcon } from '@/components/PlatformIcon';
import { mockDrafts } from '../data';
import { format, parseISO } from 'date-fns';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  FileText,
  MessageSquare,
  Plus,
  RefreshCcw,
  Send,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { Link } from 'wouter';

export default function Dashboard() {
  const { data: summary, isLoading: loadingSummary } = useGetDashboardSummary();
  const { data: activityData, isLoading: loadingActivity } = useGetRecentActivity({ limit: 10 });
  const { data: queueData, isLoading: loadingQueue } = useGetPublishingQueue();

  const metrics = [
    {
      title: "Today's Posts",
      value: summary?.todayPosts || 0,
      icon: Send,
      trend: "+2 from yesterday",
      trendUp: true,
      color: "text-hw-green",
    },
    {
      title: "Scheduled Queue",
      value: summary?.queueSize || 0,
      icon: Clock,
      trend: "Next 7 days",
      trendUp: true,
      color: "text-hw-cyan",
    },
    {
      title: "Pending Approval",
      value: summary?.pendingApprovals || 0,
      icon: CheckCircle2,
      trend: "Needs attention",
      trendUp: false,
      color: "text-hw-yellow",
    },
    {
      title: "Drafts in Progress",
      value: summary?.draftCount || mockDrafts.length,
      icon: FileText,
      trend: "Active this week",
      trendUp: true,
      color: "text-muted-foreground",
    },
  ];

  return (
    <div className="flex h-full flex-col space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your healthcare marketing campaigns and publishing queue.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <RefreshCcw className="h-4 w-4" />
            Sync Platforms
          </Button>
          <Button asChild className="gap-2">
            <Link href="/content-studio">
              <Plus className="h-4 w-4" />
              New Content
            </Link>
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.title} className="overflow-hidden transition-all hover:border-primary/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <metric.icon className={`h-4 w-4 text-muted-foreground`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loadingSummary ? '-' : metric.value}</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                {metric.trendUp ? (
                  <TrendingUp className="h-3 w-3 text-emerald-500" />
                ) : (
                  <AlertTriangle className="h-3 w-3 text-amber-500" />
                )}
                {metric.trend}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Columns */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column (Wider) */}
        <div className="flex flex-col space-y-6 lg:col-span-2">
          {/* Publishing Queue */}
          <Card className="flex flex-1 flex-col">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Publishing Queue</CardTitle>
                <CardDescription>Posts scheduled for the next 24 hours</CardDescription>
              </div>
              <Button asChild variant="ghost" size="sm" className="gap-1">
                <Link href="/scheduler">
                  View All <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="flex-1">
              <ScrollArea className="h-[300px] pr-4">
                {loadingQueue ? (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    Loading queue...
                  </div>
                ) : queueData?.items.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center space-y-3 rounded-lg border border-dashed p-8 text-center">
                    <Clock className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Queue is empty</p>
                      <p className="text-sm text-muted-foreground">No posts scheduled for today.</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {queueData?.items.slice(0, 5).map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between rounded-lg border bg-card p-4 transition-colors hover:bg-accent/50"
                      >
                        <div className="flex items-start gap-4">
                          <div className="mt-1">
                            <PlatformIcon platform={item.platform} className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium">{item.title}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <StatusBadge status={item.status} />
                              <span className="text-xs text-muted-foreground">
                                {format(parseISO(item.scheduledFor), 'h:mm a')}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* AI Insights Snippet */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="flex items-start gap-4 p-6">
              <div className="rounded-full bg-primary/20 p-2">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold text-primary">AI Content Opportunity</h4>
                <p className="text-sm text-muted-foreground">
                  Searches for "Seasonal affective disorder" are trending up 45% in your target demographic. We recommend scheduling an educational post this week.
                </p>
                <div className="pt-2">
                  <Button asChild size="sm" className="gap-2">
                    <Link href="/prompt-library">
                      Generate Draft
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="flex flex-col space-y-6">
          {/* Action Needed */}
          <Card>
            <CardHeader>
              <CardTitle>Action Needed</CardTitle>
              <CardDescription>Items requiring your approval</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockDrafts.filter(d => d.status === 'compliance_review').map((draft) => (
                  <div key={draft.id} className="flex flex-col gap-2 rounded-lg border p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-destructive">Compliance Flag</span>
                      <span className="text-xs text-muted-foreground">2 hours ago</span>
                    </div>
                    <p className="text-sm font-medium line-clamp-1">{draft.title}</p>
                    <div className="flex items-center justify-between mt-2">
                      <PlatformIcon platform={draft.platform[0]} className="h-4 w-4" />
                      <Button asChild variant="outline" size="sm" className="h-7 text-xs">
                        <Link href={`/compliance`}>
                          Review
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[250px] pr-4">
                {loadingActivity ? (
                  <div className="text-center text-sm text-muted-foreground">Loading...</div>
                ) : activityData?.items.length === 0 ? (
                  <div className="text-center text-sm text-muted-foreground">No recent activity</div>
                ) : (
                  <div className="space-y-6">
                    {activityData?.items.map((event, i) => (
                      <div key={event.id} className="relative flex gap-4">
                        {/* Timeline line */}
                        {i !== activityData.items.length - 1 && (
                          <div className="absolute left-[11px] top-6 h-full w-px bg-border" />
                        )}
                        <div className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary">
                          <Activity className="h-3 w-3 text-muted-foreground" />
                        </div>
                        <div className="flex flex-col gap-1 pb-1">
                          <p className="text-sm">
                            <span className="font-medium">{event.user || 'System'}</span>{' '}
                            <span className="text-muted-foreground">{event.title}</span>
                          </p>
                          <span className="text-xs text-muted-foreground">
                            {format(parseISO(event.timestamp), 'MMM d, h:mm a')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
