import { pgTable, text, timestamp, integer, boolean, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const brandVoicesTable = pgTable("brand_voices", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  specialty: text("specialty").notNull(),
  tone: text("tone").notNull(),
  readingLevel: text("reading_level").notNull(),
  vocabulary: text("vocabulary").notNull(),
  ctaStyle: text("cta_style").notNull(),
  emojiUsage: text("emoji_usage").notNull(), // 'none', 'minimal', 'moderate', 'frequent'
  formatting: text("formatting").notNull(),
  hashtagStyle: text("hashtag_style").notNull(),
  compliancePreferences: text("compliance_preferences").notNull(),
  writingExamples: text("writing_examples").array().notNull().default([]),
  isDefault: boolean("is_default").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertBrandVoiceSchema = createInsertSchema(brandVoicesTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertBrandVoice = z.infer<typeof insertBrandVoiceSchema>;
export type BrandVoice = typeof brandVoicesTable.$inferSelect;
