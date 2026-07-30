import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { knowledgeLibraryTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { z } from "zod/v4";

const router: IRouter = Router();

// List all knowledge items
router.get("/knowledge-library", async (req, res, next) => {
  try {
    const { type, category, limit } = z.object({
      type: z.string().optional(),
      category: z.string().optional(),
      limit: z.number().optional().default(50),
    }).parse(req.query);

    let query = db.query.knowledgeLibraryTable.findMany({
      orderBy: (item, { desc }) => [desc(item.createdAt)],
      limit: limit || 50,
    });

    const items = await query;
    let filtered = items;

    if (type) {
      filtered = filtered.filter(i => i.type === type);
    }

    if (category) {
      filtered = filtered.filter(i => i.category === category);
    }

    res.json({ items: filtered });
  } catch (err) {
    next(err);
  }
});

// Create a new knowledge item
router.post("/knowledge-library", async (req, res, next) => {
  try {
    const body = z.object({
      title: z.string().min(1),
      type: z.enum(["document", "sop", "playbook", "pdf", "research", "website", "note", "medical_reference"]),
      content: z.string().optional(),
      url: z.string().optional(),
      fileUrl: z.string().optional(),
      tags: z.array(z.string()).optional().default([]),
      category: z.string().optional(),
      summary: z.string().optional(),
      metadata: z.record(z.any()).optional(),
    }).parse(req.body);

    const id = randomUUID();

    const [inserted] = await db
      .insert(knowledgeLibraryTable)
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

// Get specific knowledge item
router.get("/knowledge-library/:id", async (req, res, next) => {
  try {
    const { id } = z.object({ id: z.string() }).parse(req.params);

    const item = await db.query.knowledgeLibraryTable.findFirst({
      where: eq(knowledgeLibraryTable.id, id),
    });

    if (!item) {
      res.status(404).json({ error: "Knowledge item not found" });
      return;
    }

    res.json(item);
  } catch (err) {
    next(err);
  }
});

// Update knowledge item
router.put("/knowledge-library/:id", async (req, res, next) => {
  try {
    const { id } = z.object({ id: z.string() }).parse(req.params);
    const body = z.object({
      title: z.string().optional(),
      content: z.string().optional(),
      url: z.string().optional(),
      tags: z.array(z.string()).optional(),
      category: z.string().optional(),
      summary: z.string().optional(),
    }).parse(req.body);

    const [updated] = await db
      .update(knowledgeLibraryTable)
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where(eq(knowledgeLibraryTable.id, id))
      .returning();

    if (!updated) {
      res.status(404).json({ error: "Knowledge item not found" });
      return;
    }

    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// Search knowledge library
router.get("/knowledge-library/search/:query", async (req, res, next) => {
  try {
    const { query } = z.object({ query: z.string() }).parse(req.params);

    const items = await db.query.knowledgeLibraryTable.findMany();

    const filtered = items.filter(item =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.summary?.toLowerCase().includes(query.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );

    res.json({ items: filtered });
  } catch (err) {
    next(err);
  }
});

// Delete knowledge item
router.delete("/knowledge-library/:id", async (req, res, next) => {
  try {
    const { id } = z.object({ id: z.string() }).parse(req.params);

    await db
      .delete(knowledgeLibraryTable)
      .where(eq(knowledgeLibraryTable.id, id));

    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
