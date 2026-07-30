import { pgTable, text, timestamp, json, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const aiWorkflowsTable = pgTable("ai_workflows", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  type: text("type").notNull(), // 'calendar', 'campaign', 'repurpose', 'email_sequence', 'faq', 'video_script', 'research_summary', 'competitor_analysis', 'website_review', 'seo_optimization', 'custom'
  steps: json("steps").$type<Array<{
    id: string;
    name: string;
    type: string;
    prompt?: string;
    inputs?: Record<string, any>;
    outputs?: string[];
  }>>().notNull().default([]),
  inputs: json("inputs").$type<Record<string, any>>().notNull().default({}),
  outputs: json("outputs").$type<Record<string, any>>().notNull().default({}),
  isTemplate: boolean("is_template").notNull().default(false),
  isFavorite: boolean("is_favorite").notNull().default(false),
  tags: text("tags").array().notNull().default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertAiWorkflowSchema = createInsertSchema(aiWorkflowsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertAiWorkflow = z.infer<typeof insertAiWorkflowSchema>;
export type AiWorkflow = typeof aiWorkflowsTable.$inferSelect;
