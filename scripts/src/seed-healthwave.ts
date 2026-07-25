import { db } from "@workspace/db";
import {
  contentItemsTable,
  platformConnectionsTable,
  campaignsTable,
  approvalRecordsTable,
  notificationsTable,
  publishingQueueItemsTable,
  scheduledPostsTable,
  publishingHistoryTable,
} from "@workspace/db";

const platforms = [
  { platform: "facebook", connected: true, profile: "HealthWave Main", status: "connected" },
  { platform: "instagram", connected: true, profile: "@healthwave", status: "connected" },
  { platform: "linkedin", connected: false, profile: "HealthWave LinkedIn", status: "expired" },
  { platform: "tiktok", connected: true, profile: "@healthwave", status: "connected" },
  { platform: "youtube", connected: false, profile: "HealthWave TV", status: "disconnected" },
  { platform: "twitter", connected: true, profile: "@healthwave", status: "connected" },
  { platform: "google_business", connected: true, profile: "HealthWave SF", status: "connected" },
  { platform: "email", connected: true, profile: "Newsletter", status: "connected" },
  { platform: "blog", connected: true, profile: "HealthWave Blog", status: "connected" },
];

const campaigns = [
  { id: "c1", name: "Mental Health Awareness Month", type: "Awareness", status: "active", goal: "Reach 50K patients", progress: 38, startDate: "Oct 1", endDate: "Oct 31", platforms: ["instagram", "facebook", "linkedin"] },
  { id: "c2", name: "Back-to-School Pediatric Checkups", type: "Patient Acquisition", status: "active", goal: "100 new patient bookings", progress: 72, startDate: "Aug 15", endDate: "Sep 30", platforms: ["facebook", "instagram"] },
  { id: "c3", name: "Anxiety Educational Series", type: "Educational", status: "active", goal: "Build thought leadership", progress: 60, startDate: "Sep 1", endDate: "Nov 15", platforms: ["linkedin", "blog"] },
  { id: "c4", name: "Winter Telehealth Push", type: "Seasonal", status: "draft", goal: "200 telehealth signups", progress: 0, startDate: "Dec 1", endDate: "Dec 31", platforms: ["all"] },
];

const contentItems = [
  {
    id: "d1",
    title: "Managing Anxiety in 2024",
    body: "Anxiety affects millions of Americans each year. Understanding the tools available for managing anxiety has never been more important.\n\nKey strategies include CBT, mindfulness, exercise, sleep hygiene, and social support. If you or someone you love is struggling, our team is here to help.",
    type: "social_post",
    specialty: "mental_health",
    category: "educational",
    platform: ["instagram", "facebook"],
    status: "compliance_review",
    campaign: "c3",
    brandVoice: "Mental Health",
    tags: ["anxiety", "mental-health", "wellness"],
  },
  {
    id: "d2",
    title: "5 Ways to Protect Enamel",
    body: "Your tooth enamel is the hardest substance in your body — but it's not indestructible. Here are 5 evidence-based ways to protect your enamel: limit acidic foods, use a soft-bristled brush, wait 30 minutes after eating to brush, stay hydrated, and use fluoride toothpaste. Book your next cleaning today!",
    type: "social_post",
    specialty: "dentistry",
    category: "tips",
    platform: ["instagram"],
    status: "published",
    tags: ["dental", "enamel", "oral-health"],
  },
  {
    id: "d3",
    title: "New Cardiology Tech Overview",
    body: "Exciting advances in cardiology technology are transforming how we diagnose and treat heart conditions. Our practice has integrated cutting-edge diagnostic tools for more precise, less invasive assessments. Learn more about how these innovations are improving patient outcomes.",
    type: "linkedin_article",
    specialty: "primary_care",
    category: "news",
    platform: ["linkedin"],
    status: "review",
    tags: ["cardiology", "technology", "innovation"],
  },
];

const approvals = [
  { id: "a1", contentId: "d1", title: "Managing Anxiety in 2024", status: "needs_review", reviewer: "Dr. Johnson", note: "Needs compliance check", timestamp: new Date("2024-10-20T09:00:00Z") },
  { id: "a2", contentId: "d3", title: "New Cardiology Tech Overview", status: "needs_review", reviewer: "Dr. Smith", note: "FDA disclaimer missing", timestamp: new Date("2024-10-22T11:00:00Z") },
];

const notifications = [
  { id: "n1", title: "LinkedIn token expired", message: "Your LinkedIn access token expired 2 days ago. 3 scheduled posts are queued but not publishing.", severity: "critical", category: "Platforms", timestamp: "2 days ago", read: false, actionLabel: "Reconnect", actionHref: "/platforms" },
  { id: "n2", title: "Compliance flag: Managing Anxiety in 2024", message: "Unverified medical claim detected. Post is on hold pending review.", severity: "high", category: "Compliance", timestamp: "3 hours ago", read: false, actionLabel: "Review Now", actionHref: "/compliance" },
  { id: "n3", title: "Post Published: 5 Ways to Protect Enamel", message: "Successfully published to Instagram at 9:00 AM. Early engagement: 142 likes, 18 comments.", severity: "low", category: "Publishing", timestamp: "Today, 9:05 AM", read: false },
  { id: "n4", title: "Weekly Analytics Report Ready", message: "Your week ending Oct 20 performance report is available. Total reach: 84.2K (+23%).", severity: "medium", category: "Analytics", timestamp: "Today, 8:00 AM", read: false, actionLabel: "View Report", actionHref: "/reports" },
];

const scheduledPosts = [
  { id: "s1", contentId: "d1", title: "Managing Anxiety in 2024", platform: "instagram", scheduledFor: new Date("2024-10-25T09:00:00Z"), timezone: "America/Los_Angeles", status: "scheduled", recurring: false, campaign: "c3" },
  { id: "s2", contentId: "d1", title: "Managing Anxiety in 2024", platform: "facebook", scheduledFor: new Date("2024-10-25T10:00:00Z"), timezone: "America/Los_Angeles", status: "scheduled", recurring: false, campaign: "c3" },
];

const queueItems = [
  { id: "q1", contentId: "d1", title: "Managing Anxiety in 2024", platform: "instagram", scheduledFor: new Date("2024-10-25T09:00:00Z"), status: "queued", priority: 1, order: 1, campaign: "c3", approvalStatus: "pending" },
  { id: "q2", contentId: "d1", title: "Managing Anxiety in 2024", platform: "facebook", scheduledFor: new Date("2024-10-25T10:00:00Z"), status: "queued", priority: 1, order: 2, campaign: "c3", approvalStatus: "pending" },
];

const history = [
  { id: "h1", contentId: "d2", title: "5 Ways to Protect Enamel", platform: "instagram", status: "published", publishedAt: new Date("2024-10-20T09:00:00Z"), user: "System" },
  { id: "h2", contentId: "d3", title: "New Cardiology Tech Overview", platform: "linkedin", status: "failed", publishedAt: new Date("2024-10-22T11:05:00Z"), error: "Token expired", user: "System" },
];

async function main() {
  await db.delete(publishingHistoryTable);
  await db.delete(publishingQueueItemsTable);
  await db.delete(scheduledPostsTable);
  await db.delete(approvalRecordsTable);
  await db.delete(notificationsTable);
  await db.delete(contentItemsTable);
  await db.delete(platformConnectionsTable);
  await db.delete(campaignsTable);

  await db.insert(platformConnectionsTable).values(
    platforms.map((p, i) => ({
      id: `p${i + 1}`,
      ...p,
      permissions: ["publish", "read"],
      capabilities: ["text", "images", "video", "links"],
      lastSync: p.connected ? new Date() : null,
      tokenExpiresAt: p.connected ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : null,
    })),
  );

  await db.insert(campaignsTable).values(campaigns);
  await db.insert(contentItemsTable).values(contentItems);
  await db.insert(approvalRecordsTable).values(approvals);
  await db.insert(notificationsTable).values(notifications);
  await db.insert(scheduledPostsTable).values(scheduledPosts);
  await db.insert(publishingQueueItemsTable).values(queueItems);
  await db.insert(publishingHistoryTable).values(history);

  console.log("HealthWave OS seed complete");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
