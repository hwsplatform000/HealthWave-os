import { pgTable, text, timestamp, json, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const competitorsTable = pgTable("competitors", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  website: text("website"),
  blog: text("blog"),
  description: text("description"),
  specialty: text("specialty"),
  location: text("location"),
  seoKeywords: text("seo_keywords").array().notNull().default([]),
  socialChannels: json("social_channels").$type<Array<{
    platform: string;
    url: string;
    followers?: number;
  }>>().notNull().default([]),
  postingFrequency: text("posting_frequency"), // 'daily', 'weekly', 'monthly', 'irregular'
  contentCategories: text("content_categories").array().notNull().default([]),
  engagementMetrics: json("engagement_metrics").$type<{
    avgEngagement?: number;
    avgReach?: number;
    topPostType?: string;
  }>(),
  notes: text("notes"),
  lastAnalyzedAt: timestamp("last_analyzed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertCompetitorSchema = createInsertSchema(competitorsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertCompetitor = z.infer<typeof insertCompetitorSchema>;
export type Competitor = typeof competitorsTable.$inferSelect;
