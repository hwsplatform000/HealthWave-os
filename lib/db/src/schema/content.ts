import { pgTable, text, timestamp, json, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const contentItemsTable = pgTable("content_items", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  type: text("type").notNull(),
  specialty: text("specialty").notNull(),
  category: text("category").notNull(),
  platform: text("platform").array().notNull().default([]),
  status: text("status").notNull().default("draft"),
  campaign: text("campaign"),
  brandVoice: text("brand_voice"),
  tags: text("tags").array().notNull().default([]),
  scheduledFor: timestamp("scheduled_for", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertContentItemSchema = createInsertSchema(contentItemsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertContentItem = z.infer<typeof insertContentItemSchema>;
export type ContentItem = typeof contentItemsTable.$inferSelect;
