import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export type StatusType = 'idea' | 'research' | 'draft' | 'review' | 'compliance_review' | 'needs_review' | 'approved' | 'scheduled' | 'published' | 'archived' | 'failed' | 'active' | 'paused' | 'completed';

interface StatusBadgeProps {
  status: StatusType | string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const s = status.toLowerCase();
  
  let variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'secondary';
  let dotColor = 'bg-gray-400';
  let label = status.replace('_', ' ');

  if (['published', 'approved', 'active', 'completed'].includes(s)) {
    variant = 'default';
    dotColor = 'bg-hw-green';
  } else if (['scheduled', 'review', 'compliance_review', 'needs_review'].includes(s)) {
    variant = 'outline';
    dotColor = 'bg-hw-yellow';
  } else if (['failed', 'rejected', 'archived', 'paused'].includes(s)) {
    variant = 'destructive';
    dotColor = 'bg-white';
  } else if (['draft', 'idea', 'research'].includes(s)) {
    variant = 'secondary';
    dotColor = 'bg-hw-cyan';
  }

  return (
    <Badge variant={variant} className={cn('capitalize flex items-center gap-1.5 w-fit font-medium', className)}>
      <span className={cn('h-1.5 w-1.5 rounded-full', dotColor)} />
      {label}
    </Badge>
  );
}
