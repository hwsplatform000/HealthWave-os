import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { publishingRulesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { z } from "zod/v4";

const router: IRouter = Router();

// List all publishing rules
router.get("/publishing-rules", async (req, res, next) => {
  try {
    const { type } = z.object({
      type: z.enum(['approval', 'compliance', 'timing', 'content', 'platform']).optional(),
    }).parse(req.query);

    let query = db.query.publishingRulesTable.findMany({
      orderBy: (rule, { asc }) => [asc(rule.name)],
    });

    if (type) {
      const items = await query;
      const filtered = items.filter(r => r.type === type);
      res.json({ items: filtered });
      return;
    }

    const items = await query;
    res.json({ items });
  } catch (err) {
    next(err);
  }
});

// Create a new publishing rule
router.post("/publishing-rules", async (req, res, next) => {
  try {
    const body = z.object({
      name: z.string().min(1),
      description: z.string().optional(),
      type: z.enum(['approval', 'compliance', 'timing', 'content', 'platform']),
      enabled: z.boolean().optional().default(true),
      conditions: z.array(z.string()).optional().default([]),
      config: z.record(z.any()).optional(),
    }).parse(req.body);

    const id = randomUUID();

    const [inserted] = await db
      .insert(publishingRulesTable)
      .values({
        id,
        name: body.name,
        description: body.description,
        type: body.type,
        enabled: body.enabled,
        conditions: body.conditions,
        config: body.config,
      })
      .returning();

    res.status(201).json(inserted);
  } catch (err) {
    next(err);
  }
});

// Get a specific publishing rule
router.get("/publishing-rules/:id", async (req, res, next) => {
  try {
    const { id } = z.object({ id: z.string() }).parse(req.params);

    const item = await db.query.publishingRulesTable.findFirst({
      where: eq(publishingRulesTable.id, id),
    });

    if (!item) {
      res.status(404).json({ error: "Publishing rule not found" });
      return;
    }

    res.json(item);
  } catch (err) {
    next(err);
  }
});

// Update a publishing rule
router.put("/publishing-rules/:id", async (req, res, next) => {
  try {
    const { id } = z.object({ id: z.string() }).parse(req.params);
    const body = z.object({
      name: z.string().min(1).optional(),
      description: z.string().optional(),
      enabled: z.boolean().optional(),
      conditions: z.array(z.string()).optional(),
      config: z.record(z.any()).optional(),
    }).parse(req.body);

    const [updated] = await db
      .update(publishingRulesTable)
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where(eq(publishingRulesTable.id, id))
      .returning();

    if (!updated) {
      res.status(404).json({ error: "Publishing rule not found" });
      return;
    }

    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// Delete a publishing rule
router.delete("/publishing-rules/:id", async (req, res, next) => {
  try {
    const { id } = z.object({ id: z.string() }).parse(req.params);

    await db
      .delete(publishingRulesTable)
      .where(eq(publishingRulesTable.id, id));

    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

// Toggle rule enabled/disabled
router.patch("/publishing-rules/:id/toggle", async (req, res, next) => {
  try {
    const { id } = z.object({ id: z.string() }).parse(req.params);

    const item = await db.query.publishingRulesTable.findFirst({
      where: eq(publishingRulesTable.id, id),
    });

    if (!item) {
      res.status(404).json({ error: "Publishing rule not found" });
      return;
    }

    const [updated] = await db
      .update(publishingRulesTable)
      .set({
        enabled: !item.enabled,
        updatedAt: new Date(),
      })
      .where(eq(publishingRulesTable.id, id))
      .returning();

    res.json(updated);
  } catch (err) {
    next(err);
  }
});

export default router;
