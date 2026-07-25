import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const approvalRecordsTable = pgTable("approval_records", {
  id: text("id").primaryKey(),
  contentId: text("content_id").notNull(),
  title: text("title").notNull(),
  status: text("status").notNull().default("needs_review"),
  reviewer: text("reviewer").notNull(),
  note: text("note"),
  deadline: timestamp("deadline", { withTimezone: true }),
  timestamp: timestamp("timestamp", { withTimezone: true }).notNull().defaultNow(),
});

export const insertApprovalRecordSchema = createInsertSchema(
  approvalRecordsTable,
).omit({
  id: true,
  timestamp: true,
});

export type InsertApprovalRecord = z.infer<typeof insertApprovalRecordSchema>;
export type ApprovalRecord = typeof approvalRecordsTable.$inferSelect;
