import { useState } from 'react';
import { useListContent } from '@workspace/api-client-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { StatusBadge } from '@/components/StatusBadge';
import { PlatformIcon } from '@/components/PlatformIcon';
import { format, parseISO } from 'date-fns';
import { FileEdit, FileText, Filter, Plus, Search, Sparkles } from 'lucide-react';
import { Link } from 'wouter';

export default function ContentStudio() {
  const { data, isLoading } = useListContent();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = data?.items?.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-full flex-col space-y-6 p-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Content Studio</h1>
          <p className="text-muted-foreground">
            Create, edit, and manage your healthcare marketing content.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Sparkles className="h-4 w-4" />
            AI Draft
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Content
          </Button>
        </div>
      </div>

      <Card className="flex flex-1 flex-col overflow-hidden border-border bg-card">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b p-4 bg-muted/20">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search content..." 
              className="pl-9 bg-background" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" /> Filters
          </Button>
        </div>
        
        <ScrollArea className="flex-1">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">Loading content...</div>
          ) : filteredItems?.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-16 text-center">
              <FileText className="h-12 w-12 text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-medium">No content found</h3>
              <p className="text-muted-foreground mt-1">Try adjusting your search or create a new post.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
              {filteredItems?.map((item) => (
                <Card key={item.id} className="group overflow-hidden flex flex-col hover:border-primary/50 transition-all cursor-pointer">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-start mb-2">
                      <StatusBadge status={item.status} className="scale-90 origin-left" />
                      <div className="flex -space-x-1">
                        {item.platform.map(p => (
                          <div key={p} className="h-6 w-6 rounded-full bg-background border flex items-center justify-center relative z-10">
                            <PlatformIcon platform={p} className="h-3 w-3" />
                          </div>
                        ))}
                      </div>
                    </div>
                    <CardTitle className="text-base line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-2 flex-1 flex flex-col justify-end">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mt-4">
                      <span className="capitalize px-2 py-1 bg-secondary rounded-md">{item.type.replace('_', ' ')}</span>
                      <span>{format(parseISO(item.updatedAt), 'MMM d')}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </Card>
    </div>
  );
}
