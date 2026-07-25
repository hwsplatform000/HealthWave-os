import { Card, CardContent } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

export default function Analytics() {
  return (
    <div className="flex h-full flex-col space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics Overview</h1>
        <p className="text-muted-foreground">
          Performance metrics across all channels.
        </p>
      </div>

      <Card className="flex flex-1 items-center justify-center border-dashed bg-transparent">
        <CardContent className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
          <BarChart3 className="h-12 w-12 mb-4 opacity-20" />
          <h2 className="text-xl font-medium text-foreground">Coming Soon</h2>
          <p className="mt-2 max-w-sm">
            This module is currently under development. Check back in a future update for analytics overview capabilities.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
