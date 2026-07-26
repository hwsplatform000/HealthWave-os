import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { promptTemplatesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { z } from "zod/v4";

const router: IRouter = Router();

// List all prompt templates
router.get("/prompts", async (req, res, next) => {
  try {
    const { category, favorite } = z.object({
      category: z.string().optional(),
      favorite: z.boolean().optional(),
    }).parse(req.query);

    let query = db.query.promptTemplatesTable.findMany({
      orderBy: (prompt, { desc }) => [desc(prompt.isFavorite)],
    });

    const items = await query;
    let filtered = items;

    if (category) {
      filtered = filtered.filter(p => p.category === category);
    }

    if (favorite) {
      filtered = filtered.filter(p => p.isFavorite === favorite);
    }

    res.json({ items: filtered });
  } catch (err) {
    next(err);
  }
});

// Create a new prompt template
router.post("/prompts", async (req, res, next) => {
  try {
    const body = z.object({
      title: z.string().min(1),
      description: z.string().optional(),
      category: z.string().min(1),
      systemPrompt: z.string().optional(),
      userPrompt: z.string().min(1),
      variables: z.array(z.string()).optional().default([]),
      isFavorite: z.boolean().optional().default(false),
      tags: z.array(z.string()).optional().default([]),
    }).parse(req.body);

    const id = randomUUID();

    const [inserted] = await db
      .insert(promptTemplatesTable)
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

// Get a specific prompt template
router.get("/prompts/:id", async (req, res, next) => {
  try {
    const { id } = z.object({ id: z.string() }).parse(req.params);

    const item = await db.query.promptTemplatesTable.findFirst({
      where: eq(promptTemplatesTable.id, id),
    });

    if (!item) {
      res.status(404).json({ error: "Prompt template not found" });
      return;
    }

    res.json(item);
  } catch (err) {
    next(err);
  }
});

// Update a prompt template
router.put("/prompts/:id", async (req, res, next) => {
  try {
    const { id } = z.object({ id: z.string() }).parse(req.params);
    const body = z.object({
      title: z.string().min(1).optional(),
      description: z.string().optional(),
      category: z.string().min(1).optional(),
      systemPrompt: z.string().optional(),
      userPrompt: z.string().min(1).optional(),
      variables: z.array(z.string()).optional(),
      isFavorite: z.boolean().optional(),
      tags: z.array(z.string()).optional(),
    }).parse(req.body);

    const [updated] = await db
      .update(promptTemplatesTable)
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where(eq(promptTemplatesTable.id, id))
      .returning();

    if (!updated) {
      res.status(404).json({ error: "Prompt template not found" });
      return;
    }

    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// Delete a prompt template
router.delete("/prompts/:id", async (req, res, next) => {
  try {
    const { id } = z.object({ id: z.string() }).parse(req.params);

    await db
      .delete(promptTemplatesTable)
      .where(eq(promptTemplatesTable.id, id));

    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

// Toggle favorite
router.patch("/prompts/:id/favorite", async (req, res, next) => {
  try {
    const { id } = z.object({ id: z.string() }).parse(req.params);

    const item = await db.query.promptTemplatesTable.findFirst({
      where: eq(promptTemplatesTable.id, id),
    });

    if (!item) {
      res.status(404).json({ error: "Prompt template not found" });
      return;
    }

    const [updated] = await db
      .update(promptTemplatesTable)
      .set({
        isFavorite: !item.isFavorite,
        updatedAt: new Date(),
      })
      .where(eq(promptTemplatesTable.id, id))
      .returning();

    res.json(updated);
  } catch (err) {
    next(err);
  }
});

export default router;
