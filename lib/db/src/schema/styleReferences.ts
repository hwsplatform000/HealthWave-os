import { pgTable, text, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const styleReferencesTable = pgTable("style_references", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'image', 'logo', 'brand_guide', 'color_palette', 'font', 'inspiration'
  url: text("url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  tags: text("tags").array().notNull().default([]),
  collection: text("collection"),
  notes: text("notes"),
  metadata: json("metadata"), // e.g., color hex codes, font families
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertStyleReferenceSchema = createInsertSchema(styleReferencesTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertStyleReference = z.infer<typeof insertStyleReferenceSchema>;
export type StyleReference = typeof styleReferencesTable.$inferSelect;
