import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { aiSettingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { z } from "zod/v4";

const router: IRouter = Router();

// Get AI settings (singleton)
router.get("/ai-settings", async (_req, res, next) => {
  try {
    let settings = await db.query.aiSettingsTable.findFirst();

    // Create default settings if none exist
    if (!settings) {
      const id = randomUUID();
      const [created] = await db
        .insert(aiSettingsTable)
        .values({
          id,
          defaultProvider: "gemini",
          defaultModel: "gemini-1.5-pro",
          temperature: 0.7,
          maxOutputLength: 2048,
          creativityLevel: 5,
          medicalAccuracyPreference: "high",
          writingStyle: "professional",
          enableWebSearch: true,
          enableReasoning: false,
        })
        .returning();
      settings = created;
    }

    res.json(settings);
  } catch (err) {
    next(err);
  }
});

// Update AI settings
router.put("/ai-settings", async (req, res, next) => {
  try {
    const body = z.object({
      defaultProvider: z.enum(["gemini", "openai", "claude", "grok", "perplexity", "openrouter"]).optional(),
      defaultModel: z.string().optional(),
      temperature: z.number().min(0).max(2).optional(),
      maxOutputLength: z.number().min(100).max(32000).optional(),
      creativityLevel: z.number().min(1).max(10).optional(),
      medicalAccuracyPreference: z.enum(["standard", "high", "strict"]).optional(),
      writingStyle: z.string().optional(),
      defaultBrandVoiceId: z.string().optional().nullable(),
      enableWebSearch: z.boolean().optional(),
      enableReasoning: z.boolean().optional(),
    }).parse(req.body);

    // Get existing settings
    let settings = await db.query.aiSettingsTable.findFirst();

    if (!settings) {
      const id = randomUUID();
      const [created] = await db
        .insert(aiSettingsTable)
        .values({
          id,
          ...body,
        })
        .returning();
      res.json(created);
      return;
    }

    // Update existing settings
    const [updated] = await db
      .update(aiSettingsTable)
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where(eq(aiSettingsTable.id, settings.id))
      .returning();

    res.json(updated);
  } catch (err) {
    next(err);
  }
});

export default router;
