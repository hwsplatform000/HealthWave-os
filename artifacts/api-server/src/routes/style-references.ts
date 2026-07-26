import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { styleReferencesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { z } from "zod/v4";

const router: IRouter = Router();

// List all style references
router.get("/style-references", async (req, res, next) => {
  try {
    const { type, collection, tag } = z.object({
      type: z.string().optional(),
      collection: z.string().optional(),
      tag: z.string().optional(),
    }).parse(req.query);

    let query = db.query.styleReferencesTable.findMany({
      orderBy: (ref, { desc }) => [desc(ref.createdAt)],
    });

    const items = await query;
    let filtered = items;

    if (type) {
      filtered = filtered.filter(r => r.type === type);
    }

    if (collection) {
      filtered = filtered.filter(r => r.collection === collection);
    }

    if (tag) {
      filtered = filtered.filter(r => r.tags.includes(tag));
    }

    res.json({ items: filtered });
  } catch (err) {
    next(err);
  }
});

// Create a new style reference
router.post("/style-references", async (req, res, next) => {
  try {
    const body = z.object({
      name: z.string().min(1),
      type: z.enum(["image", "logo", "brand_guide", "color_palette", "font", "inspiration"]),
      url: z.string().url(),
      thumbnailUrl: z.string().url().optional(),
      tags: z.array(z.string()).optional().default([]),
      collection: z.string().optional(),
      notes: z.string().optional(),
      metadata: z.record(z.any()).optional(),
    }).parse(req.body);

    const id = randomUUID();

    const [inserted] = await db
      .insert(styleReferencesTable)
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

// Get a specific style reference
router.get("/style-references/:id", async (req, res, next) => {
  try {
    const { id } = z.object({ id: z.string() }).parse(req.params);

    const item = await db.query.styleReferencesTable.findFirst({
      where: eq(styleReferencesTable.id, id),
    });

    if (!item) {
      res.status(404).json({ error: "Style reference not found" });
      return;
    }

    res.json(item);
  } catch (err) {
    next(err);
  }
});

// Update a style reference
router.put("/style-references/:id", async (req, res, next) => {
  try {
    const { id } = z.object({ id: z.string() }).parse(req.params);
    const body = z.object({
      name: z.string().min(1).optional(),
      type: z.enum(["image", "logo", "brand_guide", "color_palette", "font", "inspiration"]).optional(),
      url: z.string().url().optional(),
      thumbnailUrl: z.string().url().optional(),
      tags: z.array(z.string()).optional(),
      collection: z.string().optional(),
      notes: z.string().optional(),
      metadata: z.record(z.any()).optional(),
    }).parse(req.body);

    const [updated] = await db
      .update(styleReferencesTable)
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where(eq(styleReferencesTable.id, id))
      .returning();

    if (!updated) {
      res.status(404).json({ error: "Style reference not found" });
      return;
    }

    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// Delete a style reference
router.delete("/style-references/:id", async (req, res, next) => {
  try {
    const { id } = z.object({ id: z.string() }).parse(req.params);

    await db
      .delete(styleReferencesTable)
      .where(eq(styleReferencesTable.id, id));

    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
