import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { researchSessionsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { z } from "zod/v4";
import { categorizeResearchType } from "../lib/research-providers";

const router: IRouter = Router();

// List all research sessions
router.get("/research", async (req, res, next) => {
  try {
    const { type, specialty, limit } = z.object({
      type: z.string().optional(),
      specialty: z.string().optional(),
      limit: z.number().optional().default(20),
    }).parse(req.query);

    let query = db.query.researchSessionsTable.findMany({
      orderBy: (session, { desc }) => [desc(session.createdAt)],
      limit: limit || 20,
    });

    const items = await query;
    let filtered = items;

    if (type) {
      filtered = filtered.filter(s => s.researchType === type);
    }

    if (specialty) {
      filtered = filtered.filter(s => s.specialty === specialty);
    }

    res.json({ items: filtered });
  } catch (err) {
    next(err);
  }
});

// Create a new research session
router.post("/research", async (req, res, next) => {
  try {
    const body = z.object({
      title: z.string().min(1),
      query: z.string().min(1),
      provider: z.enum(["google", "gemini", "perplexity", "tavily", "serpapi"]),
      researchType: z.enum(["healthcare", "news", "trends", "competitor", "seo", "patient_questions", "market", "social"]).optional(),
      results: z.array(z.any()).optional().default([]),
      summary: z.string().optional(),
      tags: z.array(z.string()).optional().default([]),
      specialty: z.string().optional(),
      location: z.string().optional(),
    }).parse(req.body);

    const id = randomUUID();
    const researchType = body.researchType || categorizeResearchType(body.query);

    const [inserted] = await db
      .insert(researchSessionsTable)
      .values({
        id,
        ...body,
        researchType,
      })
      .returning();

    res.status(201).json(inserted);
  } catch (err) {
    next(err);
  }
});

// Get a specific research session
router.get("/research/:id", async (req, res, next) => {
  try {
    const { id } = z.object({ id: z.string() }).parse(req.params);

    const item = await db.query.researchSessionsTable.findFirst({
      where: eq(researchSessionsTable.id, id),
    });

    if (!item) {
      res.status(404).json({ error: "Research session not found" });
      return;
    }

    res.json(item);
  } catch (err) {
    next(err);
  }
});

// Update a research session
router.put("/research/:id", async (req, res, next) => {
  try {
    const { id } = z.object({ id: z.string() }).parse(req.params);
    const body = z.object({
      title: z.string().min(1).optional(),
      query: z.string().min(1).optional(),
      results: z.array(z.any()).optional(),
      summary: z.string().optional(),
      tags: z.array(z.string()).optional(),
    }).parse(req.body);

    const [updated] = await db
      .update(researchSessionsTable)
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where(eq(researchSessionsTable.id, id))
      .returning();

    if (!updated) {
      res.status(404).json({ error: "Research session not found" });
      return;
    }

    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// Delete a research session
router.delete("/research/:id", async (req, res, next) => {
  try {
    const { id } = z.object({ id: z.string() }).parse(req.params);

    await db
      .delete(researchSessionsTable)
      .where(eq(researchSessionsTable.id, id));

    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
