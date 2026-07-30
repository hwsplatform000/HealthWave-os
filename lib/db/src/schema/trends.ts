import { pgTable, text, timestamp, integer, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const trendsTable = pgTable("trends", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").notNull(), // 'healthcare', 'ai', 'marketing', 'social', 'algorithm', 'seasonal', 'awareness', 'viral', 'competitor'
  trendType: text("trend_type").notNull(), // 'rising', 'declining', 'stable', 'seasonal'
  relevanceScore: integer("relevance_score").notNull().default(0), // 0-100
  specialty: text("specialty"),
  location: text("location"),
  source: text("source"),
  sourceUrl: text("source_url"),
  tags: text("tags").array().notNull().default([]),
  metadata: json("metadata"),
  detectedAt: timestamp("detected_at", { withTimezone: true }).notNull().defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertTrendSchema = createInsertSchema(trendsTable).omit({
  id: true,
  detectedAt: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertTrend = z.infer<typeof insertTrendSchema>;
export type Trend = typeof trendsTable.$inferSelect;
