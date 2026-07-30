import { pgTable, text, timestamp, json, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const researchSessionsTable = pgTable("research_sessions", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  query: text("query").notNull(),
  provider: text("provider").notNull(), // 'google', 'gemini', 'perplexity', 'tavily', 'serpapi'
  researchType: text("research_type").notNull(), // 'healthcare', 'news', 'trends', 'competitor', 'seo', 'patient_questions', 'market', 'social'
  results: json("results").$type<any[]>().notNull().default([]),
  summary: text("summary"),
  tags: text("tags").array().notNull().default([]),
  specialty: text("specialty"),
  location: text("location"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertResearchSessionSchema = createInsertSchema(researchSessionsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertResearchSession = z.infer<typeof insertResearchSessionSchema>;
export type ResearchSession = typeof researchSessionsTable.$inferSelect;
