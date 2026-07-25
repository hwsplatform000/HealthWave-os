import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const campaignsTable = pgTable("campaigns", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  status: text("status").notNull().default("draft"),
  goal: text("goal").notNull(),
  progress: integer("progress").notNull().default(0),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  platforms: text("platforms").array().notNull().default([]),
});

export const insertCampaignSchema = createInsertSchema(campaignsTable).omit({
  id: true,
});

export type InsertCampaign = z.infer<typeof insertCampaignSchema>;
export type Campaign = typeof campaignsTable.$inferSelect;
