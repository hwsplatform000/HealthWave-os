import { pgTable, text, timestamp, integer, boolean, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const aiSettingsTable = pgTable("ai_settings", {
  id: text("id").primaryKey(),
  defaultProvider: text("default_provider").notNull().default("gemini"),
  defaultModel: text("default_model").notNull().default("gemini-1.5-pro"),
  temperature: real("temperature").notNull().default(0.7),
  maxOutputLength: integer("max_output_length").notNull().default(2048),
  creativityLevel: integer("creativity_level").notNull().default(5), // 1-10
  medicalAccuracyPreference: text("medical_accuracy_preference").notNull().default("high"), // 'standard', 'high', 'strict'
  writingStyle: text("writing_style").notNull().default("professional"),
  defaultBrandVoiceId: text("default_brand_voice_id"),
  enableWebSearch: boolean("enable_web_search").notNull().default(true),
  enableReasoning: boolean("enable_reasoning").notNull().default(false),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertAiSettingsSchema = createInsertSchema(aiSettingsTable).omit({
  id: true,
  updatedAt: true,
});

export type InsertAiSettings = z.infer<typeof insertAiSettingsSchema>;
export type AiSettings = typeof aiSettingsTable.$inferSelect;
