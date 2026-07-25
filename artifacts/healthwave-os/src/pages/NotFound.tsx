import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex h-full flex-col items-center justify-center p-6 text-center">
      <div className="rounded-full bg-destructive/10 p-4 mb-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
      </div>
      <h1 className="text-4xl font-bold tracking-tight mb-2">404 - Page Not Found</h1>
      <p className="text-muted-foreground mb-8 max-w-md">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link href="/">
        <Button size="lg">Return to Dashboard</Button>
      </Link>
    </div>
  );
}
