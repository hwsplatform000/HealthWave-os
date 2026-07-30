import { pgTable, text, timestamp, json, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const websiteAuditsTable = pgTable("website_audits", {
  id: text("id").primaryKey(),
  url: text("url").notNull(),
  auditType: text("audit_type").notNull(), // 'seo', 'accessibility', 'speed', 'mobile', 'ux', 'branding', 'content', 'cta', 'local_seo', 'technical_seo', 'compliance', 'ai_readiness'
  overallScore: integer("overall_score").notNull().default(0), // 0-100
  results: json("results").$type<Array<{
    category: string;
    score: number;
    findings: string[];
    recommendations: string[];
  }>>().notNull().default([]),
  recommendations: text("recommendations").array().notNull().default([]),
  auditedAt: timestamp("audited_at", { withTimezone: true }).notNull().defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertWebsiteAuditSchema = createInsertSchema(websiteAuditsTable).omit({
  id: true,
  auditedAt: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertWebsiteAudit = z.infer<typeof insertWebsiteAuditSchema>;
export type WebsiteAudit = typeof websiteAuditsTable.$inferSelect;
