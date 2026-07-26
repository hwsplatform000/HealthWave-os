import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { brandVoicesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { z } from "zod/v4";

const router: IRouter = Router();

// List all brand voices
router.get("/brand-voices", async (_req, res, next) => {
  try {
    const items = await db.query.brandVoicesTable.findMany({
      orderBy: (voice, { asc }) => [asc(voice.name)],
    });

    res.json({ items });
  } catch (err) {
    next(err);
  }
});

// Create a new brand voice
router.post("/brand-voices", async (req, res, next) => {
  try {
    const body = z.object({
      name: z.string().min(1),
      specialty: z.string().min(1),
      tone: z.string().min(1),
      readingLevel: z.string().min(1),
      vocabulary: z.string().min(1),
      ctaStyle: z.string().min(1),
      emojiUsage: z.enum(["none", "minimal", "moderate", "frequent"]),
      formatting: z.string().min(1),
      hashtagStyle: z.string().min(1),
      compliancePreferences: z.string().min(1),
      writingExamples: z.array(z.string()).optional().default([]),
      isDefault: z.boolean().optional().default(false),
    }).parse(req.body);

    const id = randomUUID();

    const [inserted] = await db
      .insert(brandVoicesTable)
      .values({
        id,
        ...body,
      })
      .returning();

    res.status(201).json(inserted);
  } catch (err) {
    next(err);
  }
});

// Get a specific brand voice
router.get("/brand-voices/:id", async (req, res, next) => {
  try {
    const { id } = z.object({ id: z.string() }).parse(req.params);

    const item = await db.query.brandVoicesTable.findFirst({
      where: eq(brandVoicesTable.id, id),
    });

    if (!item) {
      res.status(404).json({ error: "Brand voice not found" });
      return;
    }

    res.json(item);
  } catch (err) {
    next(err);
  }
});

// Update a brand voice
router.put("/brand-voices/:id", async (req, res, next) => {
  try {
    const { id } = z.object({ id: z.string() }).parse(req.params);
    const body = z.object({
      name: z.string().min(1).optional(),
      specialty: z.string().min(1).optional(),
      tone: z.string().min(1).optional(),
      readingLevel: z.string().min(1).optional(),
      vocabulary: z.string().min(1).optional(),
      ctaStyle: z.string().min(1).optional(),
      emojiUsage: z.enum(["none", "minimal", "moderate", "frequent"]).optional(),
      formatting: z.string().min(1).optional(),
      hashtagStyle: z.string().min(1).optional(),
      compliancePreferences: z.string().min(1).optional(),
      writingExamples: z.array(z.string()).optional(),
      isDefault: z.boolean().optional(),
    }).parse(req.body);

    const [updated] = await db
      .update(brandVoicesTable)
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where(eq(brandVoicesTable.id, id))
      .returning();

    if (!updated) {
      res.status(404).json({ error: "Brand voice not found" });
      return;
    }

    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// Delete a brand voice
router.delete("/brand-voices/:id", async (req, res, next) => {
  try {
    const { id } = z.object({ id: z.string() }).parse(req.params);

    await db
      .delete(brandVoicesTable)
      .where(eq(brandVoicesTable.id, id));

    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
