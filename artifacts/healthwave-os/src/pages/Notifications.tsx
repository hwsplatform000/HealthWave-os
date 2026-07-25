import { useListNotifications, useMarkNotificationsRead } from '@workspace/api-client-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format, parseISO } from 'date-fns';
import { Bell, Check, AlertCircle, Info, ShieldAlert, Activity } from 'lucide-react';
import { Link } from 'wouter';
import { toast } from 'sonner';

export default function Notifications() {
  const { data, isLoading, refetch } = useListNotifications();
  const markRead = useMarkNotificationsRead();

  const handleMarkAllRead = () => {
    const unreadIds = data?.items?.filter(n => !n.read).map(n => n.id) || [];
    if (unreadIds.length === 0) return;
    
    markRead.mutate({ data: { ids: unreadIds } }, {
      onSuccess: () => {
        toast.success('All notifications marked as read');
        refetch();
      }
    });
  };

  const getIcon = (severity: string, category: string) => {
    if (category === 'Security' || severity === 'critical') return <ShieldAlert className="h-5 w-5 text-destructive" />;
    if (severity === 'high') return <AlertCircle className="h-5 w-5 text-amber-500" />;
    if (category === 'System') return <Activity className="h-5 w-5 text-hw-cyan" />;
    return <Info className="h-5 w-5 text-primary" />;
  };

  return (
    <div className="flex h-full flex-col space-y-6 p-6 max-w-4xl mx-auto">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">
            You have {data?.unreadCount || 0} unread messages.
          </p>
        </div>
        <Button variant="outline" className="gap-2" onClick={handleMarkAllRead} disabled={!data?.unreadCount || markRead.isPending}>
          <Check className="h-4 w-4" />
          Mark all as read
        </Button>
      </div>

      <Card className="flex flex-1 flex-col overflow-hidden">
        <CardContent className="p-0 flex-1">
          <ScrollArea className="h-[calc(100vh-12rem)]">
            {isLoading ? (
              <p className="p-8 text-center text-muted-foreground">Loading notifications...</p>
            ) : data?.items?.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-16 text-center">
                <Bell className="h-12 w-12 text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-medium">All Caught Up</h3>
                <p className="text-muted-foreground mt-1">You have no notifications at this time.</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {data?.items?.map((notif) => (
                  <div key={notif.id} className={`flex gap-4 p-5 transition-colors hover:bg-accent/50 ${!notif.read ? 'bg-primary/5' : ''}`}>
                    <div className="shrink-0 mt-1">
                      {getIcon(notif.severity, notif.category)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`font-medium ${!notif.read ? 'text-foreground' : 'text-foreground/80'}`}>
                          {notif.title}
                        </p>
                        <span className="text-xs text-muted-foreground shrink-0 whitespace-nowrap">
                          {format(parseISO(notif.timestamp), 'MMM d, h:mm a')}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{notif.message}</p>
                      
                      {notif.action && (
                        <div className="pt-2">
                          <Link href={notif.action.href}>
                            <Button size="sm" variant={notif.severity === 'critical' || notif.severity === 'high' ? 'default' : 'secondary'} className="h-8">
                              {notif.action.label}
                            </Button>
                          </Link>
                        </div>
                      )}
                    </div>
                    {!notif.read && (
                      <div className="shrink-0 flex items-center">
                        <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
