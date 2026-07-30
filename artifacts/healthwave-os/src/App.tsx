import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/NotFound';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import ErrorBoundary from './components/ErrorBoundary';
import { ThemeProvider } from './contexts/ThemeContext';
import DashboardLayout from './components/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Notifications from './pages/Notifications';
import Research from './pages/Research';
import TrendCenter from './pages/TrendCenter';
import HealthcareNews from './pages/HealthcareNews';
import Competitors from './pages/Competitors';
import ContentStudio from './pages/ContentStudio';
import Campaigns from './pages/Campaigns';
import PromptLibrary from './pages/PromptLibrary';
import BrandVoice from './pages/BrandVoice';
import Calendar from './pages/CalendarPage';
import Scheduler from './pages/Scheduler';
import Platforms from './pages/Platforms';
import PublishingHistory from './pages/PublishingHistory';
import Analytics from './pages/Analytics';
import Reports from './pages/Reports';
import Insights from './pages/Insights';
import Compliance from './pages/Compliance';
import BrandKit from './pages/BrandKit';
import MediaLibrary from './pages/MediaLibrary';
import Settings from './pages/Settings';
import Integrations from './pages/Integrations';
import AIAgents from './pages/AIAgents';
import PublishingDashboard from './pages/PublishingDashboard';
import PublishingRules from './pages/PublishingRules';
import PlatformGroups from './pages/PlatformGroups';
import AISettings from './pages/AISettings';
import AIContentWorkspace from './pages/AIContentWorkspace';
import SpecialtyProfiles from './pages/SpecialtyProfiles';
import TrendCenter from './pages/TrendCenter';
import Competitors from './pages/Competitors';
import ContentIntelligence from './pages/ContentIntelligence';
import ContentPillarsPage from './pages/ContentPillarsPage';
import AIWorkflows from './pages/AIWorkflows';
import KnowledgeLibrary from './pages/KnowledgeLibrary';
import WebsiteAudit from './pages/WebsiteAudit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function Router() {
  return (
    <DashboardLayout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/notifications" component={Notifications} />
        <Route path="/research" component={Research} />
        <Route path="/trend-center" component={TrendCenter} />
        <Route path="/research/news" component={HealthcareNews} />
        <Route path="/competitors" component={Competitors} />
        <Route path="/content-studio" component={ContentStudio} />
        <Route path="/campaigns" component={Campaigns} />
        <Route path="/prompt-library" component={PromptLibrary} />
        <Route path="/brand-voice" component={BrandVoice} />
        <Route path="/calendar" component={Calendar} />
        <Route path="/scheduler" component={Scheduler} />
        <Route path="/platforms" component={Platforms} />
        <Route path="/publishing-history" component={PublishingHistory} />
        <Route path="/analytics" component={Analytics} />
        <Route path="/reports" component={Reports} />
        <Route path="/insights" component={Insights} />
        <Route path="/compliance" component={Compliance} />
        <Route path="/brand-kit" component={BrandKit} />
        <Route path="/media-library" component={MediaLibrary} />
        <Route path="/settings" component={Settings} />
        <Route path="/integrations" component={Integrations} />
        <Route path="/ai-agents" component={AIAgents} />
        <Route path="/publishing-dashboard" component={PublishingDashboard} />
        <Route path="/publishing-rules" component={PublishingRules} />
        <Route path="/platform-groups" component={PlatformGroups} />
        <Route path="/ai-settings" component={AISettings} />
        <Route path="/ai-workspace" component={AIContentWorkspace} />
        <Route path="/specialties" component={SpecialtyProfiles} />
        <Route path="/trend-center" component={TrendCenter} />
        <Route path="/competitors" component={Competitors} />
        <Route path="/content-intelligence" component={ContentIntelligence} />
        <Route path="/content-pillars" component={ContentPillarsPage} />
        <Route path="/ai-workflows" component={AIWorkflows} />
        <Route path="/knowledge-library" component={KnowledgeLibrary} />
        <Route path="/website-audit" component={WebsiteAudit} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </DashboardLayout>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="dark">
          <TooltipProvider>
            <Toaster />
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
              <Router />
            </WouterRouter>
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
