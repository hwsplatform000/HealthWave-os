import { useListPlatforms, useConnectPlatform, useDisconnectPlatform, useReconnectPlatform } from '@workspace/api-client-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlatformIcon } from '@/components/PlatformIcon';
import { StatusBadge } from '@/components/StatusBadge';
import { AlertCircle, CheckCircle2, Link2, LogOut, RefreshCw, Settings2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

export default function Platforms() {
  const { data, isLoading } = useListPlatforms();
  
  const connect = useConnectPlatform();
  const disconnect = useDisconnectPlatform();
  const reconnect = useReconnectPlatform();

  const handleConnect = (platform: string) => {
    connect.mutate(
      { data: { platform } },
      {
        onSuccess: () => toast.success(`Connected to ${platform}`, { description: 'Platform successfully integrated.' }),
        onError: () => toast.error('Connection Failed', { description: `Could not connect to ${platform}.` })
      }
    );
  };

  const handleDisconnect = (id: string, name: string) => {
    disconnect.mutate(
      { id },
      {
        onSuccess: () => toast.success('Disconnected', { description: `${name} has been removed.` }),
      }
    );
  };

  const handleReconnect = (id: string, name: string) => {
    reconnect.mutate(
      { id },
      {
        onSuccess: () => toast.success('Reconnected', { description: `${name} connection refreshed.` }),
      }
    );
  };

  const platforms = data?.items || [];
  const availablePlatforms = ['Instagram', 'Facebook', 'LinkedIn', 'Twitter', 'TikTok', 'Google_Business'];

  return (
    <div className="flex h-full flex-col space-y-6 p-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Platforms</h1>
          <p className="text-muted-foreground">
            Manage your connected social media and publishing accounts.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))
        ) : (
          platforms.map((conn) => (
            <Card key={conn.id} className="flex flex-col justify-between overflow-hidden transition-all hover:border-primary/50">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-md bg-secondary p-2">
                      <PlatformIcon platform={conn.platform} className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-lg capitalize">{conn.platform.replace('_', ' ')}</CardTitle>
                      <CardDescription className="truncate max-w-[150px]" title={conn.profile || 'Unknown'}>
                        {conn.profile || 'Account Connected'}
                      </CardDescription>
                    </div>
                  </div>
                  {conn.status === 'active' ? (
                    <CheckCircle2 className="h-5 w-5 text-hw-green" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-hw-red" />
                  )}
                </div>
              </CardHeader>
              <CardContent className="pb-4 text-sm text-muted-foreground">
                <div className="flex justify-between py-1">
                  <span>Status</span>
                  <StatusBadge status={conn.status} />
                </div>
                <div className="flex justify-between py-1">
                  <span>Last Sync</span>
                  <span className="font-medium text-foreground">
                    {conn.lastSync ? format(parseISO(conn.lastSync), 'MMM d, h:mm a') : 'Never'}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Expires</span>
                  <span className="font-medium text-foreground">
                    {conn.tokenExpiresAt ? format(parseISO(conn.tokenExpiresAt), 'MMM d, yyyy') : 'No expiry'}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2 pt-0">
                {conn.status !== 'active' ? (
                  <Button 
                    variant="default" 
                    className="w-full gap-2" 
                    onClick={() => handleReconnect(conn.id, conn.platform)}
                    disabled={reconnect.isPending}
                  >
                    <RefreshCw className="h-4 w-4" />
                    Reconnect
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" className="w-full gap-2">
                      <Settings2 className="h-4 w-4" />
                      Settings
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive gap-2"
                      onClick={() => handleDisconnect(conn.id, conn.platform)}
                      disabled={disconnect.isPending}
                    >
                      <LogOut className="h-4 w-4" />
                      Disconnect
                    </Button>
                  </>
                )}
              </CardFooter>
            </Card>
          ))
        )}

        {/* Add New Platform Card */}
        {!isLoading && availablePlatforms.filter(ap => !platforms.some(p => p.platform.toLowerCase() === ap.toLowerCase())).map(ap => (
          <Card key={ap} className="flex flex-col justify-center items-center border-dashed border-2 bg-transparent opacity-60 hover:opacity-100 transition-opacity">
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <PlatformIcon platform={ap} className="h-10 w-10 mb-4 opacity-50 grayscale" />
              <h3 className="font-semibold text-lg mb-1 capitalize">{ap.replace('_', ' ')}</h3>
              <p className="text-sm text-muted-foreground mb-4">Not connected</p>
              <Button 
                variant="outline" 
                className="gap-2"
                onClick={() => handleConnect(ap.toLowerCase())}
                disabled={connect.isPending}
              >
                <Link2 className="h-4 w-4" />
                Connect {ap.replace('_', ' ')}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
