import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { aiMemoryTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { z } from "zod/v4";

const router: IRouter = Router();

// List all memory items
router.get("/ai-memory", async (req, res, next) => {
  try {
    const { type, limit } = z.object({
      type: z.string().optional(),
      limit: z.number().optional().default(50),
    }).parse(req.query);

    let query = db.query.aiMemoryTable.findMany({
      orderBy: (memory, { desc }) => [desc(memory.lastUsedAt), desc(memory.createdAt)],
      limit: limit || 50,
    });

    const items = await query;
    let filtered = items;

    if (type) {
      filtered = filtered.filter(m => m.type === type);
    }

    res.json({ items: filtered });
  } catch (err) {
    next(err);
  }
});

// Create or update memory item
router.post("/ai-memory", async (req, res, next) => {
  try {
    const body = z.object({
      type: z.enum([
        "brand_preference",
        "specialty_preference",
        "writing_preference",
        "saved_prompt",
        "favorite_workflow",
        "hashtag",
        "audience_preference",
        "campaign_history",
      ]),
      key: z.string().min(1),
      value: z.any(),
      metadata: z.record(z.any()).optional(),
    }).parse(req.body);

    const id = randomUUID();

    const [inserted] = await db
      .insert(aiMemoryTable)
      .values({
        id,
        ...body,
        usageCount: "0",
      })
      .returning();

    res.status(201).json(inserted);
  } catch (err) {
    next(err);
  }
});

// Get specific memory item
router.get("/ai-memory/:id", async (req, res, next) => {
  try {
    const { id } = z.object({ id: z.string() }).parse(req.params);

    const item = await db.query.aiMemoryTable.findFirst({
      where: eq(aiMemoryTable.id, id),
    });

    if (!item) {
      res.status(404).json({ error: "Memory item not found" });
      return;
    }

    res.json(item);
  } catch (err) {
    next(err);
  }
});

// Update memory item
router.put("/ai-memory/:id", async (req, res, next) => {
  try {
    const { id } = z.object({ id: z.string() }).parse(req.params);
    const body = z.object({
      value: z.any().optional(),
      metadata: z.record(z.any()).optional(),
    }).parse(req.body);

    const [updated] = await db
      .update(aiMemoryTable)
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where(eq(aiMemoryTable.id, id))
      .returning();

    if (!updated) {
      res.status(404).json({ error: "Memory item not found" });
      return;
    }

    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// Increment usage count
router.patch("/ai-memory/:id/use", async (req, res, next) => {
  try {
    const { id } = z.object({ id: z.string() }).parse(req.params);

    const item = await db.query.aiMemoryTable.findFirst({
      where: eq(aiMemoryTable.id, id),
    });

    if (!item) {
      res.status(404).json({ error: "Memory item not found" });
      return;
    }

    const currentCount = parseInt(item.usageCount) || 0;

    const [updated] = await db
      .update(aiMemoryTable)
      .set({
        usageCount: (currentCount + 1).toString(),
        lastUsedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(aiMemoryTable.id, id))
      .returning();

    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// Delete memory item
router.delete("/ai-memory/:id", async (req, res, next) => {
  try {
    const { id } = z.object({ id: z.string() }).parse(req.params);

    await db
      .delete(aiMemoryTable)
      .where(eq(aiMemoryTable.id, id));

    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
