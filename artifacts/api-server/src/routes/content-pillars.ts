import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { contentPillarsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { z } from "zod/v4";

const router: IRouter = Router();

// List all content pillars
router.get("/content-pillars", async (req, res, next) => {
  try {
    const { isDefault, limit } = z.object({
      isDefault: z.string().optional(),
      limit: z.number().optional().default(50),
    }).parse(req.query);

    let query = db.query.contentPillarsTable.findMany({
      orderBy: (pillar, { desc }) => [desc(pillar.usageCount), pillar.name],
      limit: limit || 50,
    });

    const items = await query;
    let filtered = items;

    if (isDefault !== undefined) {
      const isDefaultBool = isDefault === "true";
      filtered = filtered.filter(p => (p.isDefault === "true") === isDefaultBool);
    }

    res.json({ items: filtered });
  } catch (err) {
    next(err);
  }
});

// Create a new content pillar
router.post("/content-pillars", async (req, res, next) => {
  try {
    const body = z.object({
      name: z.string().min(1),
      description: z.string().optional(),
      color: z.string().optional().default("#3B82F6"),
      icon: z.string().optional().default("📌"),
      isDefault: z.string().optional().default("false"),
    }).parse(req.body);

    const id = randomUUID();

    const [inserted] = await db
      .insert(contentPillarsTable)
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

// Get specific content pillar
router.get("/content-pillars/:id", async (req, res, next) => {
  try {
    const { id } = z.object({ id: z.string() }).parse(req.params);

    const item = await db.query.contentPillarsTable.findFirst({
      where: eq(contentPillarsTable.id, id),
    });

    if (!item) {
      res.status(404).json({ error: "Content pillar not found" });
      return;
    }

    res.json(item);
  } catch (err) {
    next(err);
  }
});

// Update content pillar
router.put("/content-pillars/:id", async (req, res, next) => {
  try {
    const { id } = z.object({ id: z.string() }).parse(req.params);
    const body = z.object({
      name: z.string().optional(),
      description: z.string().optional(),
      color: z.string().optional(),
      icon: z.string().optional(),
    }).parse(req.body);

    const [updated] = await db
      .update(contentPillarsTable)
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where(eq(contentPillarsTable.id, id))
      .returning();

    if (!updated) {
      res.status(404).json({ error: "Content pillar not found" });
      return;
    }

    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// Increment usage count
router.patch("/content-pillars/:id/use", async (req, res, next) => {
  try {
    const { id } = z.object({ id: z.string() }).parse(req.params);

    const item = await db.query.contentPillarsTable.findFirst({
      where: eq(contentPillarsTable.id, id),
    });

    if (!item) {
      res.status(404).json({ error: "Content pillar not found" });
      return;
    }

    const [updated] = await db
      .update(contentPillarsTable)
      .set({
        usageCount: item.usageCount + 1,
        updatedAt: new Date(),
      })
      .where(eq(contentPillarsTable.id, id))
      .returning();

    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// Delete content pillar
router.delete("/content-pillars/:id", async (req, res, next) => {
  try {
    const { id } = z.object({ id: z.string() }).parse(req.params);

    await db
      .delete(contentPillarsTable)
      .where(eq(contentPillarsTable.id, id));

    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
