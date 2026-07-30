import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { trendsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { z } from "zod/v4";

const router: IRouter = Router();

// List all trends
router.get("/trends", async (req, res, next) => {
  try {
    const { category, specialty, limit } = z.object({
      category: z.string().optional(),
      specialty: z.string().optional(),
      limit: z.number().optional().default(20),
    }).parse(req.query);

    let query = db.query.trendsTable.findMany({
      orderBy: (trend, { desc }) => [desc(trend.relevanceScore), desc(trend.detectedAt)],
      limit: limit || 20,
    });

    const items = await query;
    let filtered = items;

    if (category) {
      filtered = filtered.filter(t => t.category === category);
    }

    if (specialty) {
      filtered = filtered.filter(t => t.specialty === specialty);
    }

    res.json({ items: filtered });
  } catch (err) {
    next(err);
  }
});

// Create a new trend
router.post("/trends", async (req, res, next) => {
  try {
    const body = z.object({
      title: z.string().min(1),
      description: z.string().optional(),
      category: z.enum(["healthcare", "ai", "marketing", "social", "algorithm", "seasonal", "awareness", "viral", "competitor"]),
      trendType: z.enum(["rising", "declining", "stable", "seasonal"]),
      relevanceScore: z.number().min(0).max(100).optional().default(50),
      specialty: z.string().optional(),
      location: z.string().optional(),
      source: z.string().optional(),
      sourceUrl: z.string().optional(),
      tags: z.array(z.string()).optional().default([]),
      metadata: z.record(z.any()).optional(),
    }).parse(req.body);

    const id = randomUUID();

    const [inserted] = await db
      .insert(trendsTable)
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

// Get specific trend
router.get("/trends/:id", async (req, res, next) => {
  try {
    const { id } = z.object({ id: z.string() }).parse(req.params);

    const item = await db.query.trendsTable.findFirst({
      where: eq(trendsTable.id, id),
    });

    if (!item) {
      res.status(404).json({ error: "Trend not found" });
      return;
    }

    res.json(item);
  } catch (err) {
    next(err);
  }
});

// Update trend
router.put("/trends/:id", async (req, res, next) => {
  try {
    const { id } = z.object({ id: z.string() }).parse(req.params);
    const body = z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      relevanceScore: z.number().optional(),
      trendType: z.enum(["rising", "declining", "stable", "seasonal"]).optional(),
      tags: z.array(z.string()).optional(),
    }).parse(req.body);

    const [updated] = await db
      .update(trendsTable)
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where(eq(trendsTable.id, id))
      .returning();

    if (!updated) {
      res.status(404).json({ error: "Trend not found" });
      return;
    }

    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// Delete trend
router.delete("/trends/:id", async (req, res, next) => {
  try {
    const { id } = z.object({ id: z.string() }).parse(req.params);

    await db
      .delete(trendsTable)
      .where(eq(trendsTable.id, id));

    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
