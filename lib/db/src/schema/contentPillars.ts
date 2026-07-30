import { pgTable, text, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const contentPillarsTable = pgTable("content_pillars", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  color: text("color"), // hex color for UI
  icon: text("icon"), // icon name
  isDefault: text("is_default").notNull().default("false"), // 'true' or 'false' for defaults
  usageCount: integer("usage_count").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertContentPillarSchema = createInsertSchema(contentPillarsTable).omit({
  id: true,
  usageCount: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertContentPillar = z.infer<typeof insertContentPillarSchema>;
export type ContentPillar = typeof contentPillarsTable.$inferSelect;
