const fs = require('fs');

const pages = [
    ["Research", "Research & Discovery", "Dive deep into medical literature and audience research.", "Search"],
    ["TrendCenter", "Trend Center", "Monitor trending healthcare topics.", "TrendingUp"],
    ["HealthcareNews", "Healthcare News", "Latest news in the medical and marketing world.", "FileText"],
    ["Competitors", "Competitor Analysis", "Monitor what other practices are doing.", "Users"],
    ["PromptLibrary", "Prompt Library", "Reusable templates for AI content generation.", "MessageSquare"],
    ["BrandVoice", "Brand Voice", "Manage tone, vocabulary, and identity profiles.", "Palette"],
    ["Analytics", "Analytics Overview", "Performance metrics across all channels.", "BarChart3"],
    ["Reports", "Generated Reports", "Downloadable summaries and performance deep-dives.", "FileText"],
    ["Insights", "AI Insights", "Actionable recommendations derived from your data.", "Brain"],
    ["BrandKit", "Brand Kit", "Logos, colors, typography, and assets.", "Palette"],
    ["MediaLibrary", "Media Library", "Central repository for images and videos.", "Image"],
    ["Settings", "Settings", "Configure your HealthWave OS experience.", "Settings"],
    ["Integrations", "Integrations", "Connect third-party tools and EHR systems.", "Puzzle"],
    ["AIAgents", "AI Agents", "Configure specialized AI workers for your team.", "Bot"]
];

const template = (name, title, description, icon) => `import { Card, CardContent } from '@/components/ui/card';
import { ${icon} } from 'lucide-react';

export default function ${name}() {
  return (
    <div className="flex h-full flex-col space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">${title}</h1>
        <p className="text-muted-foreground">
          ${description}
        </p>
      </div>

      <Card className="flex flex-1 items-center justify-center border-dashed bg-transparent">
        <CardContent className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
          <${icon} className="h-12 w-12 mb-4 opacity-20" />
          <h2 className="text-xl font-medium text-foreground">Coming Soon</h2>
          <p className="mt-2 max-w-sm">
            This module is currently under development. Check back in a future update for ${title.toLowerCase()} capabilities.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
`;

pages.forEach(([name, title, desc, icon]) => {
    fs.writeFileSync("artifacts/healthwave-os/src/pages/" + name + ".tsx", template(name, title, desc, icon));
});
