import { pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const scheduledPostsTable = pgTable("scheduled_posts", {
  id: text("id").primaryKey(),
  contentId: text("content_id").notNull(),
  title: text("title").notNull(),
  platform: text("platform").notNull(),
  scheduledFor: timestamp("scheduled_for", { withTimezone: true }).notNull(),
  timezone: text("timezone").notNull().default("UTC"),
  status: text("status").notNull().default("scheduled"),
  recurring: boolean("recurring").notNull().default(false),
  recurrenceRule: text("recurrence_rule"),
  campaign: text("campaign"),
});

export const insertScheduledPostSchema = createInsertSchema(
  scheduledPostsTable,
).omit({
  id: true,
});

export type InsertScheduledPost = z.infer<typeof insertScheduledPostSchema>;
export type ScheduledPost = typeof scheduledPostsTable.$inferSelect;
