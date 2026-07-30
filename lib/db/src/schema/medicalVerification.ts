import { pgTable, text, timestamp, json, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const medicalVerificationTable = pgTable("medical_verification", {
  id: text("id").primaryKey(),
  contentId: text("content_id").notNull(),
  content: text("content").notNull(),
  claims: json("claims").$type<Array<{
    text: string;
    type: 'medical_claim' | 'statistic' | 'recommendation';
    status: 'verified' | 'unverified' | 'flagged';
    confidence: number;
    sources?: string[];
  }>>().notNull().default([]),
  overallConfidence: real("overall_confidence").notNull().default(0),
  verificationStatus: text("verification_status").notNull().default("pending"), // 'pending', 'verified', 'needs_review', 'flagged'
  recommendations: text("recommendations").array().notNull().default([]),
  verifiedAt: timestamp("verified_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertMedicalVerificationSchema = createInsertSchema(medicalVerificationTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertMedicalVerification = z.infer<typeof insertMedicalVerificationSchema>;
export type MedicalVerification = typeof medicalVerificationTable.$inferSelect;
