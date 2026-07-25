import { pgTable, text, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const publishingQueueItemsTable = pgTable("publishing_queue_items", {
  id: text("id").primaryKey(),
  contentId: text("content_id").notNull(),
  title: text("title").notNull(),
  platform: text("platform").notNull(),
  scheduledFor: timestamp("scheduled_for", { withTimezone: true }).notNull(),
  status: text("status").notNull().default("queued"),
  priority: integer("priority").notNull().default(0),
  order: integer("order").notNull().default(0),
  campaign: text("campaign"),
  approvalStatus: text("approval_status").notNull().default("pending"),
  paused: boolean("paused").notNull().default(false),
});

export const insertPublishingQueueItemSchema = createInsertSchema(
  publishingQueueItemsTable,
).omit({
  id: true,
});

export type InsertPublishingQueueItem = z.infer<typeof insertPublishingQueueItemSchema>;
export type PublishingQueueItem = typeof publishingQueueItemsTable.$inferSelect;
