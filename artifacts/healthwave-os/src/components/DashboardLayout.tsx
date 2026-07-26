import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Bell,
  LayoutDashboard,
  FileText,
  BarChart3,
  Megaphone,
  Sparkles,
  MessageSquare,
  Settings,
  Calendar,
  Clock,
  Share2,
  History,
  Brain,
  Search,
  TrendingUp,
  Users,
  Shield,
  Palette,
  Image,
  Puzzle,
  Bot,
  Send,
  GitBranch,
  Zap,
  Wand2,
  Layers,
} from 'lucide-react';
import type { ReactNode } from 'react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
  { icon: Bell, label: 'Notifications', href: '/notifications' },
  { icon: Search, label: 'Research', href: '/research' },
  { icon: TrendingUp, label: 'Trend Center', href: '/trend-center' },
  { icon: FileText, label: 'News', href: '/research/news' },
  { icon: Users, label: 'Competitors', href: '/competitors' },
  { icon: Sparkles, label: 'Content Studio', href: '/content-studio' },
  { icon: Megaphone, label: 'Campaigns', href: '/campaigns' },
  { icon: MessageSquare, label: 'Prompt Library', href: '/prompt-library' },
  { icon: Palette, label: 'Brand Voice', href: '/brand-voice' },
  { icon: Calendar, label: 'Calendar', href: '/calendar' },
  { icon: Clock, label: 'Scheduler', href: '/scheduler' },
  { icon: Share2, label: 'Platforms', href: '/platforms' },
  { icon: History, label: 'Publishing History', href: '/publishing-history' },
  { icon: BarChart3, label: 'Analytics', href: '/analytics' },
  { icon: FileText, label: 'Reports', href: '/reports' },
  { icon: Brain, label: 'Insights', href: '/insights' },
  { icon: Shield, label: 'Compliance', href: '/compliance' },
  { icon: Palette, label: 'Brand Kit', href: '/brand-kit' },
  { icon: Image, label: 'Media Library', href: '/media-library' },
  { icon: Puzzle, label: 'Integrations', href: '/integrations' },
  { icon: Bot, label: 'AI Agents', href: '/ai-agents' },
  { icon: Send, label: 'Publishing Dashboard', href: '/publishing-dashboard' },
  { icon: Shield, label: 'Publishing Rules', href: '/publishing-rules' },
  { icon: GitBranch, label: 'Platform Groups', href: '/platform-groups' },
  { icon: Zap, label: 'AI Settings', href: '/ai-settings' },
  { icon: Sparkles, label: 'AI Workspace', href: '/ai-workspace' },
  { icon: Wand2, label: 'Prompt Library', href: '/prompt-library' },
  { icon: Layers, label: 'Specialties', href: '/specialties' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      <aside className="flex w-64 flex-col border-r border-border bg-sidebar">
        <div className="border-b border-border p-4">
          <span className="text-lg font-bold text-sidebar-primary">
            HealthWave OS
          </span>
        </div>
        <ScrollArea className="flex-1">
          <nav className="space-y-1 p-3">
            {navItems.map((item) => {
              const isActive = location === item.href;
              return (
                <Link key={item.href} href={item.href} className={`flex w-full items-center justify-start gap-3 rounded-md px-4 py-2 text-sm font-medium transition-colors ${isActive ? 'bg-secondary text-secondary-foreground' : 'hover:bg-accent hover:text-accent-foreground'}`}>
                  <item.icon className="h-4 w-4" />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </ScrollArea>
      </aside>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
