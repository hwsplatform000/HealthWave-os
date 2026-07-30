import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { aiWorkflowsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { z } from "zod/v4";

const router: IRouter = Router();

// List all workflows
router.get("/ai-workflows", async (req, res, next) => {
  try {
    const { type, isTemplate, limit } = z.object({
      type: z.string().optional(),
      isTemplate: z.string().optional(),
      limit: z.number().optional().default(50),
    }).parse(req.query);

    let query = db.query.aiWorkflowsTable.findMany({
      orderBy: (workflow, { desc }) => [desc(workflow.isFavorite), desc(workflow.createdAt)],
      limit: limit || 50,
    });

    const items = await query;
    let filtered = items;

    if (type) {
      filtered = filtered.filter(w => w.type === type);
    }

    if (isTemplate !== undefined) {
      const isTemplateBool = isTemplate === "true";
      filtered = filtered.filter(w => w.isTemplate === isTemplateBool);
    }

    res.json({ items: filtered });
  } catch (err) {
    next(err);
  }
});

// Create a new workflow
router.post("/ai-workflows", async (req, res, next) => {
  try {
    const body = z.object({
      name: z.string().min(1),
      description: z.string().optional(),
      type: z.enum([
        "calendar",
        "campaign",
        "repurpose",
        "email_sequence",
        "faq",
        "video_script",
        "research_summary",
        "competitor_analysis",
        "website_review",
        "seo_optimization",
        "custom",
      ]),
      steps: z.array(z.any()).optional().default([]),
      inputs: z.record(z.any()).optional().default({}),
      outputs: z.record(z.any()).optional().default({}),
      isTemplate: z.boolean().optional().default(false),
      isFavorite: z.boolean().optional().default(false),
      tags: z.array(z.string()).optional().default([]),
    }).parse(req.body);

    const id = randomUUID();

    const [inserted] = await db
      .insert(aiWorkflowsTable)
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

// Get specific workflow
router.get("/ai-workflows/:id", async (req, res, next) => {
  try {
    const { id } = z.object({ id: z.string() }).parse(req.params);

    const item = await db.query.aiWorkflowsTable.findFirst({
      where: eq(aiWorkflowsTable.id, id),
    });

    if (!item) {
      res.status(404).json({ error: "Workflow not found" });
      return;
    }

    res.json(item);
  } catch (err) {
    next(err);
  }
});

// Update workflow
router.put("/ai-workflows/:id", async (req, res, next) => {
  try {
    const { id } = z.object({ id: z.string() }).parse(req.params);
    const body = z.object({
      name: z.string().optional(),
      description: z.string().optional(),
      steps: z.array(z.any()).optional(),
      inputs: z.record(z.any()).optional(),
      outputs: z.record(z.any()).optional(),
      tags: z.array(z.string()).optional(),
    }).parse(req.body);

    const [updated] = await db
      .update(aiWorkflowsTable)
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where(eq(aiWorkflowsTable.id, id))
      .returning();

    if (!updated) {
      res.status(404).json({ error: "Workflow not found" });
      return;
    }

    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// Toggle favorite
router.patch("/ai-workflows/:id/favorite", async (req, res, next) => {
  try {
    const { id } = z.object({ id: z.string() }).parse(req.params);

    const item = await db.query.aiWorkflowsTable.findFirst({
      where: eq(aiWorkflowsTable.id, id),
    });

    if (!item) {
      res.status(404).json({ error: "Workflow not found" });
      return;
    }

    const [updated] = await db
      .update(aiWorkflowsTable)
      .set({
        isFavorite: !item.isFavorite,
        updatedAt: new Date(),
      })
      .where(eq(aiWorkflowsTable.id, id))
      .returning();

    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// Delete workflow
router.delete("/ai-workflows/:id", async (req, res, next) => {
  try {
    const { id } = z.object({ id: z.string() }).parse(req.params);

    await db
      .delete(aiWorkflowsTable)
      .where(eq(aiWorkflowsTable.id, id));

    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
