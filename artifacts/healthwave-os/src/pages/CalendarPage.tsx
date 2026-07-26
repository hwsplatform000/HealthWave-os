import { useState } from 'react';
import { useGetScheduledPosts, useListCampaigns } from '@workspace/api-client-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StatusBadge } from '@/components/StatusBadge';
import { PlatformIcon } from '@/components/PlatformIcon';
import { 
  format, 
  parseISO, 
  addDays, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameDay, 
  startOfMonth, 
  endOfMonth, 
  isSameMonth,
  addMonths,
  subMonths,
  subDays
} from 'date-fns';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Filter, Plus } from 'lucide-react';
import { Link } from 'wouter';

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'week' | 'month'>('week');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  
  const calendarStart = view === 'week' ? startOfWeek(currentDate) : startOfWeek(startOfMonth(currentDate));
  const calendarEnd = view === 'week' ? endOfWeek(currentDate) : endOfWeek(endOfMonth(currentDate));
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const { data: postsData, isLoading: postsLoading } = useGetScheduledPosts({
    start: calendarStart.toISOString(),
    end: calendarEnd.toISOString()
  });

  const { data: campaignsData } = useListCampaigns();

  const handlePrev = () => {
    if (view === 'week') {
      setCurrentDate(prev => subDays(prev, 7));
    } else {
      setCurrentDate(prev => subMonths(prev, 1));
    }
  };

  const handleNext = () => {
    if (view === 'week') {
      setCurrentDate(prev => addDays(prev, 7));
    } else {
      setCurrentDate(prev => addMonths(prev, 1));
    }
  };

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
            {view === 'week' ? (
              `${format(calendarStart, 'MMMM d')} - ${format(calendarEnd, 'MMMM d, yyyy')}`
            ) : (
              format(currentDate, 'MMMM yyyy')
            )}
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
          <div className={`grid grid-cols-7 min-w-[800px] divide-x divide-sidebar-border border-b border-sidebar-border bg-background ${view === 'month' ? 'auto-rows-fr min-h-[600px]' : 'h-full'}`}>
            {/* Day Headers */}
            {days.slice(0, 7).map((day) => (
              <div key={`header-${day.toString()}`} className="p-3 text-center border-b border-sidebar-border bg-muted/20">
                <p className="text-xs font-bold text-muted-foreground uppercase">{format(day, 'EEE')}</p>
              </div>
            ))}

            {/* Calendar Days */}
            {days.map((day) => {
              const isToday = isSameDay(day, new Date());
              const isCurrentMonth = isSameMonth(day, currentDate);
              
              return (
                <div 
                  key={day.toString()} 
                  className={`flex flex-col min-h-[120px] ${!isCurrentMonth && view === 'month' ? 'bg-muted/5 opacity-50' : 'bg-background'} ${isToday ? 'ring-1 ring-inset ring-primary/30 bg-primary/5' : ''}`}
                >
                  <div className="p-2 flex justify-between items-start">
                    <span className={`text-sm ${isToday ? 'font-bold text-primary' : 'font-medium text-muted-foreground'}`}>
                      {format(day, 'd')}
                    </span>
                  </div>
                  <div className="flex-1 p-1 space-y-1 overflow-y-auto max-h-[150px]">
                    {postsLoading ? (
                      <div className="h-4 bg-muted/20 animate-pulse rounded-sm" />
                    ) : (
                      postsData?.items
                        ?.filter((post) => isSameDay(parseISO(post.scheduledFor), day))
                        ?.filter((post) => platformFilter === 'all' || post.platform.toLowerCase() === platformFilter)
                        ?.map((post) => (
                          <div 
                            key={post.id} 
                            className="group relative flex flex-col gap-0.5 rounded border border-sidebar-border bg-card px-1.5 py-1 text-[10px] shadow-sm hover:border-primary/50 transition-colors cursor-pointer"
                          >
                            <div className="flex items-center justify-between gap-1">
                              <span className="font-semibold text-muted-foreground truncate">
                                {format(parseISO(post.scheduledFor), 'h:mm a')}
                              </span>
                              <PlatformIcon platform={post.platform} className="h-2.5 w-2.5 shrink-0" />
                            </div>
                            <p className="font-medium leading-tight line-clamp-1" title={post.title}>{post.title}</p>
                          </div>
                        ))
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
