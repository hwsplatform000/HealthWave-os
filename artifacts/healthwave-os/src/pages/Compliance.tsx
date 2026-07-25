import { useState } from 'react';
import { useListApprovals, useApproveContent } from '@workspace/api-client-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { StatusBadge } from '@/components/StatusBadge';
import { format, parseISO } from 'date-fns';
import { AlertTriangle, Check, MessageSquare, ShieldAlert, X } from 'lucide-react';
import { toast } from 'sonner';

export default function Compliance() {
  const { data, isLoading } = useListApprovals();
  const approveMutation = useApproveContent();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [note, setNote] = useState('');

  const handleAction = (id: string, action: 'approve' | 'reject') => {
    approveMutation.mutate(
      { id, data: { note } },
      {
        onSuccess: () => {
          toast.success(`Content ${action === 'approve' ? 'approved' : 'rejected'}`);
          setSelectedId(null);
          setNote('');
        },
        onError: () => toast.error('Failed to process approval')
      }
    );
  };

  const pendingApprovals = data?.items?.filter(item => item.status === 'needs_review' || item.status === 'compliance_review') || [];

  return (
    <div className="flex h-full flex-col space-y-6 p-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Compliance & Approvals</h1>
          <p className="text-muted-foreground">
            Review content flagged for medical accuracy, HIPAA, or brand compliance.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: List */}
        <div className="flex flex-col space-y-4 lg:col-span-1">
          <Card className="flex flex-1 flex-col h-[calc(100vh-12rem)]">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-lg flex items-center justify-between">
                Review Queue
                <span className="bg-primary/20 text-primary px-2 py-0.5 rounded-full text-xs font-semibold">
                  {pendingApprovals.length}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-0">
              <ScrollArea className="h-full">
                {isLoading ? (
                  <p className="p-4 text-center text-muted-foreground">Loading...</p>
                ) : pendingApprovals.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                    <Check className="h-8 w-8 mb-2 text-hw-green" />
                    <p>All caught up!</p>
                    <p className="text-sm">No pending items in queue.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {pendingApprovals.map((item) => (
                      <button
                        key={item.id}
                        className={`w-full text-left p-4 hover:bg-accent/50 transition-colors ${selectedId === item.id ? 'bg-accent border-l-2 border-primary' : 'border-l-2 border-transparent'}`}
                        onClick={() => setSelectedId(item.id)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <StatusBadge status={item.status} className="scale-90 origin-left" />
                          <span className="text-xs text-muted-foreground">
                            {format(parseISO(item.timestamp), 'MMM d, h:mm a')}
                          </span>
                        </div>
                        <p className="font-medium line-clamp-2 leading-snug">{item.title}</p>
                        <p className="text-xs text-muted-foreground mt-2">Requested by {item.reviewer}</p>
                      </button>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Details */}
        <div className="flex flex-col space-y-4 lg:col-span-2">
          {selectedId ? (
            <Card className="flex flex-col h-[calc(100vh-12rem)]">
              <CardHeader className="border-b bg-card pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl leading-tight">
                      {pendingApprovals.find(i => i.id === selectedId)?.title}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      Submitted on {format(parseISO(pendingApprovals.find(i => i.id === selectedId)?.timestamp || new Date().toISOString()), 'MMMM d, yyyy')}
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2 shrink-0">
                    <MessageSquare className="h-4 w-4" />
                    View Original
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-auto p-6 space-y-6">
                <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
                  <div className="flex gap-3">
                    <ShieldAlert className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-destructive">Compliance Flag: Unverified Medical Claim</h4>
                      <p className="text-sm mt-1 text-foreground/80">
                        {pendingApprovals.find(i => i.id === selectedId)?.note || "The content contains a claim about treatment efficacy that does not have a cited source or disclaimer. Please review against FTC and FDA guidelines."}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Content Preview</h4>
                  <div className="rounded-md border bg-muted/20 p-4 font-serif text-sm leading-relaxed whitespace-pre-wrap">
                    This is a placeholder for the actual content body since the list endpoint only provides summaries. 
                    <br/><br/>
                    "Our new treatment guarantees a 99% success rate in resolving chronic back pain within just two sessions. Schedule your appointment today!"
                    <br/><br/>
                    #HealthWave #PainRelief
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Reviewer Notes</h4>
                  <Textarea 
                    placeholder="Add feedback, requested changes, or approval notes..." 
                    className="min-h-[100px] resize-none"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter className="border-t bg-muted/20 p-4 flex justify-end gap-3">
                <Button 
                  variant="destructive" 
                  onClick={() => handleAction(selectedId, 'reject')}
                  disabled={approveMutation.isPending}
                >
                  <X className="h-4 w-4 mr-2" />
                  Request Changes
                </Button>
                <Button 
                  variant="default"
                  onClick={() => handleAction(selectedId, 'approve')}
                  disabled={approveMutation.isPending}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Approve Content
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Card className="flex flex-col h-[calc(100vh-12rem)] items-center justify-center p-8 border-dashed bg-transparent">
              <ShieldAlert className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <CardTitle className="text-xl text-muted-foreground">No Item Selected</CardTitle>
              <CardDescription className="max-w-sm text-center mt-2">
                Select an item from the queue on the left to review its compliance flags and approve or request changes.
              </CardDescription>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
