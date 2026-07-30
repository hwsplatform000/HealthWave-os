import { pgTable, text, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const aiMemoryTable = pgTable("ai_memory", {
  id: text("id").primaryKey(),
  type: text("type").notNull(), // 'brand_preference', 'specialty_preference', 'writing_preference', 'saved_prompt', 'favorite_workflow', 'hashtag', 'audience_preference', 'campaign_history'
  key: text("key").notNull(),
  value: json("value").notNull(),
  metadata: json("metadata"),
  usageCount: text("usage_count").notNull().default("0"),
  lastUsedAt: timestamp("last_used_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertAiMemorySchema = createInsertSchema(aiMemoryTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertAiMemory = z.infer<typeof insertAiMemorySchema>;
export type AiMemory = typeof aiMemoryTable.$inferSelect;
