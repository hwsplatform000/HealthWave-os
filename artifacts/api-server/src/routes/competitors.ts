import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { competitorsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { z } from "zod/v4";

const router: IRouter = Router();

// List all competitors
router.get("/competitors", async (req, res, next) => {
  try {
    const { specialty, limit } = z.object({
      specialty: z.string().optional(),
      limit: z.number().optional().default(20),
    }).parse(req.query);

    let query = db.query.competitorsTable.findMany({
      orderBy: (comp, { asc }) => [asc(comp.name)],
      limit: limit || 20,
    });

    const items = await query;
    let filtered = items;

    if (specialty) {
      filtered = filtered.filter(c => c.specialty === specialty);
    }

    res.json({ items: filtered });
  } catch (err) {
    next(err);
  }
});

// Create a new competitor profile
router.post("/competitors", async (req, res, next) => {
  try {
    const body = z.object({
      name: z.string().min(1),
      website: z.string().optional(),
      blog: z.string().optional(),
      description: z.string().optional(),
      specialty: z.string().optional(),
      location: z.string().optional(),
      seoKeywords: z.array(z.string()).optional().default([]),
      socialChannels: z.array(z.object({
        platform: z.string(),
        url: z.string(),
        followers: z.number().optional(),
      })).optional().default([]),
      postingFrequency: z.enum(["daily", "weekly", "monthly", "irregular"]).optional(),
      contentCategories: z.array(z.string()).optional().default([]),
      engagementMetrics: z.object({
        avgEngagement: z.number().optional(),
        avgReach: z.number().optional(),
        topPostType: z.string().optional(),
      }).optional(),
      notes: z.string().optional(),
    }).parse(req.body);

    const id = randomUUID();

    const [inserted] = await db
      .insert(competitorsTable)
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

// Get specific competitor
router.get("/competitors/:id", async (req, res, next) => {
  try {
    const { id } = z.object({ id: z.string() }).parse(req.params);

    const item = await db.query.competitorsTable.findFirst({
      where: eq(competitorsTable.id, id),
    });

    if (!item) {
      res.status(404).json({ error: "Competitor not found" });
      return;
    }

    res.json(item);
  } catch (err) {
    next(err);
  }
});

// Update competitor
router.put("/competitors/:id", async (req, res, next) => {
  try {
    const { id } = z.object({ id: z.string() }).parse(req.params);
    const body = z.object({
      name: z.string().optional(),
      website: z.string().optional(),
      blog: z.string().optional(),
      description: z.string().optional(),
      seoKeywords: z.array(z.string()).optional(),
      postingFrequency: z.enum(["daily", "weekly", "monthly", "irregular"]).optional(),
      contentCategories: z.array(z.string()).optional(),
      notes: z.string().optional(),
    }).parse(req.body);

    const [updated] = await db
      .update(competitorsTable)
      .set({
        ...body,
        lastAnalyzedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(competitorsTable.id, id))
      .returning();

    if (!updated) {
      res.status(404).json({ error: "Competitor not found" });
      return;
    }

    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// Delete competitor
router.delete("/competitors/:id", async (req, res, next) => {
  try {
    const { id } = z.object({ id: z.string() }).parse(req.params);

    await db
      .delete(competitorsTable)
      .where(eq(competitorsTable.id, id));

    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
