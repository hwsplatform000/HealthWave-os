import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const publishingHistoryTable = pgTable("publishing_history", {
  id: text("id").primaryKey(),
  contentId: text("content_id").notNull(),
  title: text("title").notNull(),
  platform: text("platform").notNull(),
  status: text("status").notNull(),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  campaign: text("campaign"),
  error: text("error"),
  user: text("user").notNull().default("System"),
});

export const insertPublishingHistorySchema = createInsertSchema(
  publishingHistoryTable,
).omit({
  id: true,
});

export type InsertPublishingHistory = z.infer<typeof insertPublishingHistorySchema>;
export type PublishingHistory = typeof publishingHistoryTable.$inferSelect;
