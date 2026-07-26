import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';
import { CheckCircle2, Clock, AlertCircle, FileText, Shield, Send, Archive } from 'lucide-react';

export interface TimelineEvent {
  id: string;
  status: 'draft' | 'review' | 'compliance' | 'approved' | 'scheduled' | 'publishing' | 'published' | 'failed' | 'archived';
  timestamp: string;
  user?: string;
  message?: string;
}

interface PublishingTimelineProps {
  events: TimelineEvent[];
  currentStatus: TimelineEvent['status'];
}

const statusConfig: Record<TimelineEvent['status'], { icon: any; label: string; color: string }> = {
  draft: { icon: FileText, label: 'Draft Created', color: 'text-muted-foreground' },
  review: { icon: Clock, label: 'Internal Review', color: 'text-hw-blue' },
  compliance: { icon: Shield, label: 'Compliance Review', color: 'text-hw-yellow' },
  approved: { icon: CheckCircle2, label: 'Approved', color: 'text-hw-green' },
  scheduled: { icon: Clock, label: 'Scheduled', color: 'text-hw-cyan' },
  publishing: { icon: Send, label: 'Publishing', color: 'text-hw-purple' },
  published: { icon: CheckCircle2, label: 'Published', color: 'text-hw-green' },
  failed: { icon: AlertCircle, label: 'Failed', color: 'text-hw-red' },
  archived: { icon: Archive, label: 'Archived', color: 'text-muted-foreground' },
};

export default function PublishingTimeline({ events, currentStatus }: PublishingTimelineProps) {
  const sortedEvents = [...events].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-semibold">Publishing Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedEvents.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4">No timeline events yet</p>
          ) : (
            sortedEvents.map((event, index) => {
              const config = statusConfig[event.status];
              const Icon = config.icon;
              const isCurrentStatus = event.status === currentStatus;

              return (
                <div key={event.id} className="relative flex gap-4">
                  {/* Timeline line */}
                  {index !== sortedEvents.length - 1 && (
                    <div className="absolute left-[17px] top-8 h-8 w-px bg-border" />
                  )}

                  {/* Timeline dot */}
                  <div className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${isCurrentStatus ? 'bg-primary/20 ring-2 ring-primary' : 'bg-secondary'}`}>
                    <Icon className={`h-4 w-4 ${config.color}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-1">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-semibold">{config.label}</p>
                      {isCurrentStatus && (
                        <Badge variant="default" className="text-[10px]">Current</Badge>
                      )}
                    </div>
                    {event.user && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        by <span className="font-medium">{event.user}</span>
                      </p>
                    )}
                    {event.message && (
                      <p className="text-xs text-muted-foreground mt-1">{event.message}</p>
                    )}
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {format(parseISO(event.timestamp), 'MMM d, yyyy h:mm a')}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
