import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { platformGroupsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { z } from "zod/v4";

const router: IRouter = Router();

// List all platform groups
router.get("/platform-groups", async (_req, res, next) => {
  try {
    const items = await db.query.platformGroupsTable.findMany({
      orderBy: (group, { asc }) => [asc(group.name)],
    });

    res.json({ items });
  } catch (err) {
    next(err);
  }
});

// Create a new platform group
router.post("/platform-groups", async (req, res, next) => {
  try {
    const body = z.object({
      name: z.string().min(1),
      description: z.string().optional(),
      platforms: z.array(z.string()).min(1),
      isDefault: z.boolean().optional().default(false),
    }).parse(req.body);

    const id = randomUUID();

    const [inserted] = await db
      .insert(platformGroupsTable)
      .values({
        id,
        name: body.name,
        description: body.description,
        platforms: body.platforms,
        isDefault: body.isDefault,
      })
      .returning();

    res.status(201).json(inserted);
  } catch (err) {
    next(err);
  }
});

// Get a specific platform group
router.get("/platform-groups/:id", async (req, res, next) => {
  try {
    const { id } = z.object({ id: z.string() }).parse(req.params);

    const item = await db.query.platformGroupsTable.findFirst({
      where: eq(platformGroupsTable.id, id),
    });

    if (!item) {
      res.status(404).json({ error: "Platform group not found" });
      return;
    }

    res.json(item);
  } catch (err) {
    next(err);
  }
});

// Update a platform group
router.put("/platform-groups/:id", async (req, res, next) => {
  try {
    const { id } = z.object({ id: z.string() }).parse(req.params);
    const body = z.object({
      name: z.string().min(1).optional(),
      description: z.string().optional(),
      platforms: z.array(z.string()).min(1).optional(),
    }).parse(req.body);

    const [updated] = await db
      .update(platformGroupsTable)
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where(eq(platformGroupsTable.id, id))
      .returning();

    if (!updated) {
      res.status(404).json({ error: "Platform group not found" });
      return;
    }

    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// Delete a platform group
router.delete("/platform-groups/:id", async (req, res, next) => {
  try {
    const { id } = z.object({ id: z.string() }).parse(req.params);

    await db
      .delete(platformGroupsTable)
      .where(eq(platformGroupsTable.id, id));

    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
