import { pgTable, text, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const knowledgeLibraryTable = pgTable("knowledge_library", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  type: text("type").notNull(), // 'document', 'sop', 'playbook', 'pdf', 'research', 'website', 'note', 'medical_reference'
  content: text("content"),
  url: text("url"),
  fileUrl: text("file_url"),
  tags: text("tags").array().notNull().default([]),
  category: text("category"),
  summary: text("summary"),
  metadata: json("metadata"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertKnowledgeLibrarySchema = createInsertSchema(knowledgeLibraryTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertKnowledgeLibrary = z.infer<typeof insertKnowledgeLibrarySchema>;
export type KnowledgeLibrary = typeof knowledgeLibraryTable.$inferSelect;
