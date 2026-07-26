import { pgTable, text, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const specialtyProfilesTable = pgTable("specialty_profiles", {
  id: text("id").primaryKey(),
  name: text("name").notNull(), // Display name
  slug: text("slug").notNull().unique(), // e.g., 'mental-health'
  description: text("description"),
  keyTopics: text("key_topics").array().notNull().default([]),
  targetAudience: text("target_audience"),
  complianceGuidelines: text("compliance_guidelines"),
  metadata: json("metadata"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertSpecialtyProfileSchema = createInsertSchema(specialtyProfilesTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertSpecialtyProfile = z.infer<typeof insertSpecialtyProfileSchema>;
export type SpecialtyProfile = typeof specialtyProfilesTable.$inferSelect;
