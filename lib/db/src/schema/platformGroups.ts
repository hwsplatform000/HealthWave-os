import { pgTable, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const platformGroupsTable = pgTable("platform_groups", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  platforms: text("platforms").array().notNull().default([]),
  isDefault: boolean("is_default").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertPlatformGroupSchema = createInsertSchema(
  platformGroupsTable,
).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertPlatformGroup = z.infer<typeof insertPlatformGroupSchema>;
export type PlatformGroup = typeof platformGroupsTable.$inferSelect;
