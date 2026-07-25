import { pgTable, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const notificationsTable = pgTable("notifications", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  severity: text("severity").notNull(),
  category: text("category").notNull(),
  timestamp: text("timestamp").notNull(),
  read: boolean("read").notNull().default(false),
  actionLabel: text("action_label"),
  actionHref: text("action_href"),
});

export const insertNotificationSchema = createInsertSchema(
  notificationsTable,
).omit({
  id: true,
});

export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notificationsTable.$inferSelect;
