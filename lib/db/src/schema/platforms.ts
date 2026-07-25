import { pgTable, text, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const platformConnectionsTable = pgTable("platform_connections", {
  id: text("id").primaryKey(),
  platform: text("platform").notNull(),
  connected: boolean("connected").notNull().default(false),
  profile: text("profile"),
  permissions: text("permissions").array().notNull().default([]),
  capabilities: text("capabilities").array().notNull().default([]),
  lastSync: timestamp("last_sync", { withTimezone: true }),
  tokenExpiresAt: timestamp("token_expires_at", { withTimezone: true }),
  status: text("status").notNull().default("disconnected"),
});

export const insertPlatformConnectionSchema = createInsertSchema(
  platformConnectionsTable,
).omit({
  id: true,
  lastSync: true,
  tokenExpiresAt: true,
});

export type InsertPlatformConnection = z.infer<typeof insertPlatformConnectionSchema>;
export type PlatformConnection = typeof platformConnectionsTable.$inferSelect;
