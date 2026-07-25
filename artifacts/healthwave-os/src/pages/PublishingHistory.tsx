import { useState } from 'react';
import { useGetPublishingHistory } from '@workspace/api-client-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StatusBadge } from '@/components/StatusBadge';
import { PlatformIcon } from '@/components/PlatformIcon';
import { format, parseISO } from 'date-fns';
import { Download, ExternalLink, Filter, Search, RotateCcw } from 'lucide-react';
import { Link } from 'wouter';

export default function PublishingHistory() {
  const { data, isLoading } = useGetPublishingHistory({ limit: 50 });
  const [searchTerm, setSearchTerm] = useState('');
  const [platformFilter, setPlatformFilter] = useState('all');

  const filteredItems = data?.items?.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlatform = platformFilter === 'all' || item.platform.toLowerCase() === platformFilter;
    return matchesSearch && matchesPlatform;
  });

  return (
    <div className="flex h-full flex-col space-y-6 p-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Publishing History</h1>
          <p className="text-muted-foreground">
            View past publications and failed posts.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      <Card className="flex flex-1 flex-col overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b p-4">
          <div className="flex flex-1 items-center gap-2 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search history..." 
                className="pl-9" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={platformFilter} onValueChange={setPlatformFilter}>
              <SelectTrigger className="w-[160px]">
                <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
                <SelectItem value="facebook">Facebook</SelectItem>
                <SelectItem value="twitter">Twitter</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <ScrollArea className="flex-1">
          {isLoading ? (
            <div className="flex items-center justify-center p-12 text-muted-foreground">
              Loading history...
            </div>
          ) : filteredItems?.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
              <p className="text-lg font-medium">No results found</p>
              <p className="text-sm">Try adjusting your filters or search term.</p>
            </div>
          ) : (
            <div className="w-full">
              <table className="w-full text-left text-sm">
                <thead className="sticky top-0 bg-muted/50 text-muted-foreground z-10 border-b backdrop-blur">
                  <tr>
                    <th className="font-medium p-4">Content</th>
                    <th className="font-medium p-4">Platform</th>
                    <th className="font-medium p-4">Date</th>
                    <th className="font-medium p-4">Status</th>
                    <th className="font-medium p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredItems?.map((item) => (
                    <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-4">
                        <p className="font-medium text-foreground max-w-md truncate" title={item.title}>
                          {item.title}
                        </p>
                        {item.error && (
                          <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                            <span className="font-semibold">Error:</span> {item.error}
                          </p>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <PlatformIcon platform={item.platform} className="h-4 w-4" />
                          <span className="capitalize">{item.platform}</span>
                        </div>
                      </td>
                      <td className="p-4 whitespace-nowrap text-muted-foreground">
                        {item.publishedAt ? format(parseISO(item.publishedAt), 'MMM d, yyyy h:mm a') : '—'}
                      </td>
                      <td className="p-4">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="p-4 text-right">
                        {item.status === 'failed' ? (
                          <Button variant="outline" size="sm" className="gap-2">
                            <RotateCcw className="h-3.5 w-3.5" />
                            Retry
                          </Button>
                        ) : (
                          <Button variant="ghost" size="sm" className="gap-2 text-primary hover:text-primary">
                            <ExternalLink className="h-3.5 w-3.5" />
                            View Post
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </ScrollArea>
      </Card>
    </div>
  );
}
