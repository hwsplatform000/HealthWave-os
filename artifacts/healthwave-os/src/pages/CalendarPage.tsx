import { useState } from 'react';
import { useGetScheduledPosts, useListCampaigns } from '@workspace/api-client-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StatusBadge } from '@/components/StatusBadge';
import { PlatformIcon } from '@/components/PlatformIcon';
import { format, parseISO, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Filter, Plus } from 'lucide-react';
import { Link } from 'wouter';

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'week' | 'month'>('week');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  
  const weekStart = startOfWeek(currentDate);
  const weekEnd = endOfWeek(currentDate);
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const { data: postsData, isLoading: postsLoading } = useGetScheduledPosts({
    start: weekStart.toISOString(),
    end: weekEnd.toISOString()
  });

  const { data: campaignsData } = useListCampaigns();

  const handlePrev = () => setCurrentDate(prev => addDays(prev, view === 'week' ? -7 : -30));
  const handleNext = () => setCurrentDate(prev => addDays(prev, view === 'week' ? 7 : 30));

  return (
    <div className="flex h-full flex-col space-y-6 p-6">
      {/* Header & Controls */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground">
            Plan and visualize your upcoming campaigns.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center rounded-md border p-1 bg-card">
            <Button 
              variant={view === 'week' ? 'secondary' : 'ghost'} 
              size="sm" 
              onClick={() => setView('week')}
            >
              Week
            </Button>
            <Button 
              variant={view === 'month' ? 'secondary' : 'ghost'} 
              size="sm" 
              onClick={() => setView('month')}
              disabled
              title="Month view coming soon"
            >
              Month
            </Button>
          </div>
          
          <div className="flex items-center gap-2 border-l pl-3 ml-1">
            <Select value={platformFilter} onValueChange={setPlatformFilter}>
              <SelectTrigger className="w-[140px]">
                <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
                <SelectItem value="facebook">Facebook</SelectItem>
              </SelectContent>
            </Select>

            <Button asChild className="gap-2">
              <Link href="/scheduler">
                <Plus className="h-4 w-4" />
                Schedule
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Calendar View */}
      <Card className="flex flex-1 flex-col overflow-hidden border-sidebar-border bg-sidebar">
        <div className="flex items-center justify-between border-b border-sidebar-border p-4 bg-background/50">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-primary" />
            {format(weekStart, 'MMMM d')} - {format(weekEnd, 'MMMM d, yyyy')}
          </h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={handlePrev}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
              Today
            </Button>
            <Button variant="outline" size="icon" onClick={handleNext}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="grid grid-cols-7 min-w-[800px] h-full divide-x divide-sidebar-border border-b border-sidebar-border bg-background">
            {/* Day Headers */}
            {days.map((day) => {
              const isToday = isSameDay(day, new Date());
              return (
                <div key={day.toString()} className="flex flex-col">
                  <div className={`p-3 text-center border-b border-sidebar-border ${isToday ? 'bg-primary/10' : ''}`}>
                    <p className="text-xs font-medium text-muted-foreground uppercase">{format(day, 'EEE')}</p>
                    <p className={`text-2xl mt-1 ${isToday ? 'font-bold text-primary' : 'font-medium'}`}>
                      {format(day, 'd')}
                    </p>
                  </div>
                  <div className="flex-1 p-2 min-h-[400px] bg-sidebar/30">
                    {postsLoading ? (
                      <div className="h-20 bg-muted/20 animate-pulse rounded-md mt-2" />
                    ) : (
                      <div className="space-y-2 mt-1">
                        {postsData?.items
                          ?.filter((post) => isSameDay(parseISO(post.scheduledFor), day))
                          ?.filter((post) => platformFilter === 'all' || post.platform.toLowerCase() === platformFilter)
                          ?.map((post) => (
                            <div 
                              key={post.id} 
                              className="group relative flex flex-col gap-1.5 rounded-md border border-sidebar-border bg-card p-2 text-sm shadow-sm hover:border-primary/50 transition-colors"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-xs text-muted-foreground">
                                  {format(parseISO(post.scheduledFor), 'h:mm a')}
                                </span>
                                <PlatformIcon platform={post.platform} className="h-3 w-3" />
                              </div>
                              <p className="font-medium leading-snug line-clamp-2" title={post.title}>{post.title}</p>
                              {post.campaign && (
                                <p className="text-[10px] text-muted-foreground truncate">
                                  {campaignsData?.items.find(c => c.id === post.campaign)?.name || post.campaign}
                                </p>
                              )}
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
}
