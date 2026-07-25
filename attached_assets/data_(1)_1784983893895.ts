// HealthWave OS — Central data store (client-side state)
// All mock data and types live here for easy future API replacement

export type ContentStatus = 'idea' | 'research' | 'draft' | 'review' | 'compliance_review' | 'approved' | 'scheduled' | 'published' | 'archived';
export type Platform = 'instagram' | 'facebook' | 'linkedin' | 'tiktok' | 'youtube' | 'twitter' | 'google_business' | 'email' | 'blog' | 'all';
export type ContentType = 'social_post' | 'blog_article' | 'email_campaign' | 'landing_page' | 'newsletter' | 'patient_education' | 'faq' | 'video_script' | 'carousel' | 'infographic' | 'reel' | 'short' | 'youtube_script' | 'linkedin_article' | 'google_business_post' | 'practice_announcement';
export type Specialty = 'mental_health' | 'dentistry' | 'orthodontics' | 'plastic_surgery' | 'dermatology' | 'vision' | 'fertility' | 'pediatrics' | 'primary_care' | 'substance_abuse' | 'physical_therapy' | 'home_health' | 'weight_management' | 'audiology' | 'hospitals' | 'behavioral_health';
export type ContentCategory = 'educational' | 'tips' | 'faq' | 'questions' | 'patient_stories' | 'behind_scenes' | 'testimonials' | 'promotions' | 'community' | 'awareness' | 'news' | 'seasonal' | 'hiring' | 'events' | 'custom';

export interface ContentItem {
  id: string;
  title: string;
  body: string;
  type: ContentType;
  specialty: Specialty;
  category: ContentCategory;
  platform: Platform[];
  status: ContentStatus;
  campaign?: string;
  brandVoice?: string;
  tags: string[];
  seo: { keywords: string[]; metaTitle: string; metaDescription: string; slug: string; };
  analytics: { contentId: string; campaignId?: string; platform: Platform; publishDate?: string; engagement?: number; clicks?: number; };
  versions: ContentVersion[];
  approvals: ApprovalRecord[];
  complianceFlags: ComplianceFlag[];
  createdAt: string;
  updatedAt: string;
  scheduledFor?: string;
  repurposedFrom?: string;
  repurposedTo?: string[];
}

export interface ContentVersion {
  id: string;
  body: string;
  author: string;
  timestamp: string;
  note?: string;
}

export interface ApprovalRecord {
  id: string;
  status: 'draft' | 'needs_review' | 'approved' | 'rejected' | 'changes_requested' | 'published';
  reviewer: string;
  note?: string;
  timestamp: string;
}

export interface ComplianceFlag {
  id: string;
  type: 'hipaa' | 'medical_claim' | 'fda' | 'ftc' | 'missing_disclaimer';
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  resolved: boolean;
}

export interface BrandVoiceProfile {
  id: string;
  name: string;
  specialty: string;
  tone: string;
  vocabulary: string;
  readingLevel: string;
  formality: number; // 1-10
  sentenceLength: string;
  emojiPreference: string;
  ctaStyle: string;
  personality: string;
}

export interface PromptTemplate {
  id: string;
  title: string;
  category: string;
  prompt: string;
  isFavorite: boolean;
  tags: string[];
}

export interface ContentTemplate {
  id: string;
  name: string;
  type: ContentType;
  structure: { label: string; placeholder: string; }[];
}

export interface Campaign {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'draft' | 'paused' | 'completed';
  goal: string;
  progress: number;
  created: number;
  published: number;
  reach: string;
  startDate: string;
  endDate: string;
  platforms: Platform[];
  metric: string;
  metricValue: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  timestamp: string;
  read: boolean;
  action?: { label: string; href: string; };
}

// ---- MOCK DATA ----

export const mockCampaigns: Campaign[] = [
  { id: 'c1', name: 'Mental Health Awareness Month', type: 'Awareness', status: 'active', goal: 'Reach 50K patients', progress: 38, created: 8, published: 5, reach: '21.4K', startDate: 'Oct 1', endDate: 'Oct 31', platforms: ['instagram', 'facebook', 'linkedin'], metric: '+42% above target', metricValue: '' },
  { id: 'c2', name: 'Back-to-School Pediatric Checkups', type: 'Patient Acquisition', status: 'active', goal: '100 new patient bookings', progress: 72, created: 14, published: 10, reach: '38.2K', startDate: 'Aug 15', endDate: 'Sep 30', platforms: ['facebook', 'instagram'], metric: '68 bookings so far', metricValue: '' },
  { id: 'c3', name: 'Anxiety Educational Series', type: 'Educational', status: 'active', goal: 'Build thought leadership', progress: 60, created: 6, published: 6, reach: '12.8K', startDate: 'Sep 1', endDate: 'Nov 15', platforms: ['linkedin', 'blog'], metric: '2.4K content shares', metricValue: '' },
  { id: 'c4', name: 'Winter Telehealth Push', type: 'Seasonal', status: 'draft', goal: '200 telehealth signups', progress: 0, created: 0, published: 0, reach: '—', startDate: 'Dec 1', endDate: 'Dec 31', platforms: ['all'], metric: 'Not started', metricValue: '' },
  { id: 'c5', name: 'Heart Health Month February', type: 'Awareness', status: 'draft', goal: 'Brand awareness', progress: 0, created: 2, published: 0, reach: '—', startDate: 'Feb 1', endDate: 'Feb 28', platforms: ['instagram', 'facebook'], metric: 'Planning stage', metricValue: '' },
  { id: 'c6', name: 'Q3 Dental Awareness', type: 'Educational', status: 'completed', goal: '40K reach', progress: 100, created: 20, published: 20, reach: '48.2K', startDate: 'Jul 1', endDate: 'Sep 30', platforms: ['instagram', 'facebook', 'twitter'], metric: '48.2K reached (+20%)', metricValue: '' },
];

export const mockNotifications: Notification[] = [
  { id: 'n1', title: 'LinkedIn token expired', message: 'Your LinkedIn access token expired 2 days ago. 3 scheduled posts are queued but not publishing.', severity: 'critical', category: 'Platforms', timestamp: '2 days ago', read: false, action: { label: 'Reconnect', href: '/platforms' } },
  { id: 'n2', title: 'Compliance flag: Managing Anxiety in 2024', message: 'Unverified medical claim detected on line 2. Post is on hold pending review.', severity: 'high', category: 'Compliance', timestamp: '3 hours ago', read: false, action: { label: 'Review Now', href: '/compliance' } },
  { id: 'n3', title: 'AI Recommendation: Child anxiety content opportunity', message: 'Back-to-school anxiety searches are up 34%. Educational content is outperforming promotional by 42%.', severity: 'high', category: 'AI', timestamp: '1 hour ago', read: false, action: { label: 'Create Post', href: '/content-studio' } },
  { id: 'n4', title: 'Post Published: 5 Ways to Protect Enamel', message: 'Successfully published to Instagram at 9:00 AM. Early engagement: 142 likes, 18 comments.', severity: 'low', category: 'Publishing', timestamp: 'Today, 9:05 AM', read: false },
  { id: 'n5', title: 'Weekly Analytics Report Ready', message: 'Your week ending Oct 20 performance report is available. Total reach: 84.2K (+23%).', severity: 'medium', category: 'Analytics', timestamp: 'Today, 8:00 AM', read: false, action: { label: 'View Report', href: '/reports' } },
  { id: 'n6', title: 'Mental Health Awareness Month starts in 8 days', message: 'October 1 is Mental Health Awareness Month. No campaign is currently scheduled for this period.', severity: 'medium', category: 'News', timestamp: 'Yesterday', read: true, action: { label: 'Plan Campaign', href: '/campaigns' } },
  { id: 'n7', title: 'Trending: AI in Healthcare diagnostics', message: 'AI healthcare searches are up 52% this week. Great opportunity for thought leadership content.', severity: 'medium', category: 'Trends', timestamp: 'Yesterday', read: true },
  { id: 'n8', title: 'Security: New login detected', message: 'A new device logged into your account from San Francisco, CA at 7:42 AM.', severity: 'high', category: 'Security', timestamp: 'Yesterday, 7:42 AM', read: true, action: { label: 'Review Activity', href: '/settings' } },
  { id: 'n9', title: 'System: Scheduled maintenance', message: 'HealthWave platform will undergo scheduled maintenance on Oct 25, 2:00–4:00 AM UTC.', severity: 'low', category: 'System', timestamp: 'Oct 20', read: true },
];

export const mockBrandVoices: BrandVoiceProfile[] = [
  { id: 'bv1', name: 'HealthWave', specialty: 'General', tone: 'Professional & Empathetic', vocabulary: 'Medical but accessible', readingLevel: 'Grade 8-10', formality: 7, sentenceLength: 'Medium', emojiPreference: 'Minimal', ctaStyle: 'Action-oriented', personality: 'Trusted advisor' },
  { id: 'bv2', name: 'Mental Health', specialty: 'Mental Health', tone: 'Warm & Supportive', vocabulary: 'Compassionate, non-stigmatizing', readingLevel: 'Grade 6-8', formality: 5, sentenceLength: 'Short to medium', emojiPreference: 'Occasional', ctaStyle: 'Gentle encouragement', personality: 'Empathetic guide' },
  { id: 'bv3', name: 'Dental', specialty: 'Dentistry', tone: 'Friendly & Educational', vocabulary: 'Simple dental terms', readingLevel: 'Grade 6-8', formality: 6, sentenceLength: 'Short', emojiPreference: 'Moderate', ctaStyle: 'Direct & clear', personality: 'Approachable expert' },
  { id: 'bv4', name: 'Plastic Surgery', specialty: 'Plastic Surgery', tone: 'Sophisticated & Confident', vocabulary: 'Premium, aspirational', readingLevel: 'Grade 10-12', formality: 8, sentenceLength: 'Medium to long', emojiPreference: 'None', ctaStyle: 'Exclusive invitation', personality: 'Luxury consultant' },
  { id: 'bv5', name: 'Vision', specialty: 'Vision', tone: 'Clear & Informative', vocabulary: 'Eye care terminology simplified', readingLevel: 'Grade 7-9', formality: 6, sentenceLength: 'Medium', emojiPreference: 'Minimal', ctaStyle: 'Educational CTA', personality: 'Knowledgeable friend' },
  { id: 'bv6', name: 'Weight Loss', specialty: 'Weight Management', tone: 'Motivational & Supportive', vocabulary: 'Positive, non-shaming', readingLevel: 'Grade 6-8', formality: 4, sentenceLength: 'Short', emojiPreference: 'Moderate', ctaStyle: 'Motivational', personality: 'Supportive coach' },
  { id: 'bv7', name: 'Home Health', specialty: 'Home Health', tone: 'Caring & Reassuring', vocabulary: 'Simple, family-friendly', readingLevel: 'Grade 5-7', formality: 4, sentenceLength: 'Short', emojiPreference: 'Occasional', ctaStyle: 'Compassionate CTA', personality: 'Caring neighbor' },
];

export const mockPromptTemplates: PromptTemplate[] = [
  { id: 'pt1', title: 'Educational Post Hook', category: 'Educational', prompt: 'Write an engaging hook for an educational post about [TOPIC] targeting [AUDIENCE]. The hook should create curiosity and promise value within 2 sentences.', isFavorite: true, tags: ['hook', 'educational', 'social'] },
  { id: 'pt2', title: 'Patient FAQ Answer', category: 'Patient Engagement', prompt: 'Answer the following patient question in a clear, empathetic, and medically accurate way: [QUESTION]. Include a brief explanation and a gentle CTA to consult a healthcare provider.', isFavorite: true, tags: ['faq', 'patient', 'educational'] },
  { id: 'pt3', title: 'Instagram Caption — Healthcare Tip', category: 'Social Media', prompt: 'Write an Instagram caption for a healthcare tip about [TOPIC]. Include: 1) An attention-grabbing first line, 2) 3-4 key points as bullet points, 3) A CTA, 4) 5-8 relevant hashtags.', isFavorite: false, tags: ['instagram', 'caption', 'tips'] },
  { id: 'pt4', title: 'LinkedIn Thought Leadership', category: 'Social Media', prompt: 'Write a LinkedIn article introduction about [TOPIC] in healthcare. Position the author as a thought leader. Use a personal anecdote or surprising statistic to open.', isFavorite: true, tags: ['linkedin', 'thought-leadership', 'article'] },
  { id: 'pt5', title: 'Email Newsletter Intro', category: 'Email', prompt: 'Write an email newsletter introduction for [PRACTICE NAME] covering [MAIN TOPICS]. Keep it warm, personal, and under 100 words. Include a preview of what readers will find inside.', isFavorite: false, tags: ['email', 'newsletter', 'intro'] },
  { id: 'pt6', title: 'Blog Post Outline', category: 'Blog', prompt: 'Create a detailed blog post outline for the topic: [TOPIC]. Target audience: [AUDIENCE]. Include: H1, H2 sections, key points per section, and suggested word count per section.', isFavorite: false, tags: ['blog', 'outline', 'seo'] },
  { id: 'pt7', title: 'Video Script — Patient Education', category: 'Video', prompt: 'Write a 60-second video script explaining [MEDICAL TOPIC] to patients. Use simple language, include a hook in the first 5 seconds, and end with a clear CTA.', isFavorite: false, tags: ['video', 'script', 'patient-education'] },
  { id: 'pt8', title: 'Awareness Campaign Post', category: 'Healthcare Awareness', prompt: 'Write a social media post for [AWARENESS MONTH/DAY] related to [HEALTH TOPIC]. Include key statistics, empathetic messaging, and a resource or action for readers.', isFavorite: true, tags: ['awareness', 'campaign', 'social'] },
  { id: 'pt9', title: 'SEO Meta Description', category: 'SEO', prompt: 'Write an SEO meta description for a healthcare page about [TOPIC]. Keep it under 160 characters, include the primary keyword [KEYWORD], and make it compelling for click-through.', isFavorite: false, tags: ['seo', 'meta', 'web'] },
  { id: 'pt10', title: 'Campaign Brief Summary', category: 'Campaigns', prompt: 'Write a campaign brief summary for [CAMPAIGN NAME]. Include: objective, target audience, key message, platforms, timeline, and success metrics.', isFavorite: false, tags: ['campaign', 'brief', 'strategy'] },
];

export const mockContentTemplates: ContentTemplate[] = [
  { id: 'ct1', name: 'Educational Post', type: 'social_post', structure: [{ label: 'Hook', placeholder: 'Start with a surprising fact or question...' }, { label: 'Problem', placeholder: 'Describe the challenge or pain point...' }, { label: 'Explanation', placeholder: 'Provide context and education...' }, { label: 'Solution', placeholder: 'Offer actionable advice or insight...' }, { label: 'CTA', placeholder: 'Call to action...' }] },
  { id: 'ct2', name: 'FAQ Post', type: 'faq', structure: [{ label: 'Question', placeholder: 'State the patient question clearly...' }, { label: 'Answer', placeholder: 'Provide a clear, accurate answer...' }, { label: 'Action', placeholder: 'What should the reader do next?...' }] },
  { id: 'ct3', name: 'Patient Story', type: 'patient_education', structure: [{ label: 'Challenge', placeholder: 'Describe the patient\'s initial challenge...' }, { label: 'Journey', placeholder: 'Describe the treatment journey...' }, { label: 'Outcome', placeholder: 'Share the positive outcome...' }, { label: 'Lesson', placeholder: 'What can readers learn from this?...' }] },
  { id: 'ct4', name: 'Blog Article', type: 'blog_article', structure: [{ label: 'Title', placeholder: 'SEO-optimized article title...' }, { label: 'Introduction', placeholder: 'Hook the reader and preview the content...' }, { label: 'Main Content', placeholder: 'Detailed, valuable content...' }, { label: 'Conclusion', placeholder: 'Summarize and reinforce key points...' }, { label: 'CTA', placeholder: 'What should readers do next?...' }] },
  { id: 'ct5', name: 'Video Script', type: 'video_script', structure: [{ label: 'Hook (0-5s)', placeholder: 'Grab attention immediately...' }, { label: 'Problem (5-15s)', placeholder: 'State the problem or question...' }, { label: 'Content (15-50s)', placeholder: 'Deliver the main value...' }, { label: 'CTA (50-60s)', placeholder: 'Clear call to action...' }] },
];

export const mockDrafts: ContentItem[] = [
  {
    id: 'd1', title: 'Managing Anxiety in 2024', body: 'Anxiety affects millions of Americans each year. As we navigate an increasingly complex world, understanding the tools available for managing anxiety has never been more important.\n\nIn this post, we explore evidence-based strategies that can help patients and their families cope with anxiety disorders.\n\n**Key strategies include:**\n- Cognitive Behavioral Therapy (CBT)\n- Mindfulness and meditation practices\n- Regular physical exercise\n- Healthy sleep hygiene\n- Social support networks\n\nIf you or someone you love is struggling with anxiety, our team of mental health professionals is here to help. Schedule a consultation today.',
    type: 'social_post', specialty: 'mental_health', category: 'educational', platform: ['instagram', 'facebook'], status: 'compliance_review',
    campaign: 'c3', brandVoice: 'bv2', tags: ['anxiety', 'mental-health', 'wellness'],
    seo: { keywords: ['anxiety management', 'mental health tips', 'anxiety treatment'], metaTitle: 'Managing Anxiety in 2024 | HealthWave', metaDescription: 'Discover evidence-based strategies for managing anxiety. Expert guidance from HealthWave mental health professionals.', slug: 'managing-anxiety-2024' },
    analytics: { contentId: 'd1', campaignId: 'c3', platform: 'instagram' },
    versions: [{ id: 'v1', body: 'Original draft...', author: 'Dr. Johnson', timestamp: '2024-10-18T10:00:00Z', note: 'Initial draft' }, { id: 'v2', body: 'Revised with CBT section...', author: 'Dr. Johnson', timestamp: '2024-10-19T14:30:00Z', note: 'Added CBT details' }],
    approvals: [{ id: 'a1', status: 'needs_review', reviewer: 'Dr. Johnson', note: 'Needs compliance check', timestamp: '2024-10-20T09:00:00Z' }],
    complianceFlags: [{ id: 'cf1', type: 'medical_claim', description: 'Unverified medical claim on line 2', severity: 'high', resolved: false }],
    createdAt: '2024-10-18T10:00:00Z', updatedAt: '2024-10-20T09:00:00Z',
  },
  {
    id: 'd2', title: '5 Ways to Protect Enamel', body: 'Your tooth enamel is the hardest substance in your body — but it\'s not indestructible.\n\nHere are 5 evidence-based ways to protect your enamel:\n\n1. **Limit acidic foods and drinks** — Citrus, soda, and vinegar-based foods erode enamel over time\n2. **Use a soft-bristled toothbrush** — Hard bristles wear down enamel\n3. **Wait 30 minutes after eating to brush** — Acid softens enamel temporarily\n4. **Stay hydrated** — Saliva neutralizes acids naturally\n5. **Use fluoride toothpaste** — Strengthens and remineralizes enamel\n\nProtect your smile — book your next cleaning today! 🦷',
    type: 'social_post', specialty: 'dentistry', category: 'tips', platform: ['instagram'], status: 'published',
    campaign: undefined, brandVoice: 'bv3', tags: ['dental', 'enamel', 'oral-health'],
    seo: { keywords: ['tooth enamel protection', 'dental tips', 'oral health'], metaTitle: '5 Ways to Protect Enamel | HealthWave Dental', metaDescription: 'Protect your tooth enamel with these 5 evidence-based tips from our dental experts.', slug: '5-ways-protect-enamel' },
    analytics: { contentId: 'd2', platform: 'instagram', publishDate: '2024-10-20', engagement: 4200, clicks: 312 },
    versions: [{ id: 'v1', body: 'Initial draft', author: 'Dr. Johnson', timestamp: '2024-10-15T08:00:00Z' }],
    approvals: [{ id: 'a1', status: 'published', reviewer: 'Dr. Johnson', timestamp: '2024-10-20T08:45:00Z' }],
    complianceFlags: [],
    createdAt: '2024-10-15T08:00:00Z', updatedAt: '2024-10-20T09:05:00Z',
  },
  {
    id: 'd3', title: 'New Cardiology Tech Overview', body: 'Exciting advances in cardiology technology are transforming how we diagnose and treat heart conditions.\n\nOur practice has recently integrated cutting-edge diagnostic tools that allow for more precise, less invasive assessments.\n\nKey technologies include:\n- Advanced echocardiography\n- AI-assisted ECG interpretation\n- Remote cardiac monitoring\n\nLearn more about how these innovations are improving patient outcomes.',
    type: 'linkedin_article', specialty: 'primary_care', category: 'news', platform: ['linkedin'], status: 'review',
    campaign: undefined, brandVoice: 'bv1', tags: ['cardiology', 'technology', 'innovation'],
    seo: { keywords: ['cardiology technology', 'heart health', 'cardiac diagnostics'], metaTitle: 'New Cardiology Technology | HealthWave', metaDescription: 'Discover the latest cardiology technologies improving patient care at HealthWave.', slug: 'new-cardiology-tech-overview' },
    analytics: { contentId: 'd3', platform: 'linkedin' },
    versions: [{ id: 'v1', body: 'Initial draft', author: 'Dr. Johnson', timestamp: '2024-10-22T11:00:00Z' }],
    approvals: [{ id: 'a1', status: 'needs_review', reviewer: 'Dr. Johnson', timestamp: '2024-10-22T11:00:00Z' }],
    complianceFlags: [{ id: 'cf1', type: 'ftc', description: 'FDA disclaimer missing', severity: 'medium', resolved: false }],
    createdAt: '2024-10-22T11:00:00Z', updatedAt: '2024-10-22T11:00:00Z',
  },
];

