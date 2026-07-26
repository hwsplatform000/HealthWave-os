import { pgTable, text, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const publishingRulesTable = pgTable("publishing_rules", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  type: text("type").notNull(), // 'approval', 'compliance', 'timing', 'content', 'platform'
  enabled: boolean("enabled").notNull().default(true),
  conditions: text("conditions").array().notNull().default([]),
  config: json("config"), // Additional rule-specific configuration
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertPublishingRuleSchema = createInsertSchema(
  publishingRulesTable,
).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertPublishingRule = z.infer<typeof insertPublishingRuleSchema>;
export type PublishingRule = typeof publishingRulesTable.$inferSelect;
