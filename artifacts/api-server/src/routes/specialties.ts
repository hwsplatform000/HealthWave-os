import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { specialtyProfilesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { z } from "zod/v4";

const router: IRouter = Router();

// List all specialty profiles
router.get("/specialties", async (_req, res, next) => {
  try {
    const items = await db.query.specialtyProfilesTable.findMany({
      orderBy: (specialty, { asc }) => [asc(specialty.name)],
    });

    res.json({ items });
  } catch (err) {
    next(err);
  }
});

// Create a new specialty profile
router.post("/specialties", async (req, res, next) => {
  try {
    const body = z.object({
      name: z.string().min(1),
      slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
      description: z.string().optional(),
      keyTopics: z.array(z.string()).optional().default([]),
      targetAudience: z.string().optional(),
      complianceGuidelines: z.string().optional(),
      metadata: z.record(z.any()).optional(),
    }).parse(req.body);

    const id = randomUUID();

    const [inserted] = await db
      .insert(specialtyProfilesTable)
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

// Get a specific specialty profile
router.get("/specialties/:id", async (req, res, next) => {
  try {
    const { id } = z.object({ id: z.string() }).parse(req.params);

    const item = await db.query.specialtyProfilesTable.findFirst({
      where: eq(specialtyProfilesTable.id, id),
    });

    if (!item) {
      res.status(404).json({ error: "Specialty profile not found" });
      return;
    }

    res.json(item);
  } catch (err) {
    next(err);
  }
});

// Get specialty by slug
router.get("/specialties/slug/:slug", async (req, res, next) => {
  try {
    const { slug } = z.object({ slug: z.string() }).parse(req.params);

    const item = await db.query.specialtyProfilesTable.findFirst({
      where: eq(specialtyProfilesTable.slug, slug),
    });

    if (!item) {
      res.status(404).json({ error: "Specialty profile not found" });
      return;
    }

    res.json(item);
  } catch (err) {
    next(err);
  }
});

// Update a specialty profile
router.put("/specialties/:id", async (req, res, next) => {
  try {
    const { id } = z.object({ id: z.string() }).parse(req.params);
    const body = z.object({
      name: z.string().min(1).optional(),
      description: z.string().optional(),
      keyTopics: z.array(z.string()).optional(),
      targetAudience: z.string().optional(),
      complianceGuidelines: z.string().optional(),
      metadata: z.record(z.any()).optional(),
    }).parse(req.body);

    const [updated] = await db
      .update(specialtyProfilesTable)
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where(eq(specialtyProfilesTable.id, id))
      .returning();

    if (!updated) {
      res.status(404).json({ error: "Specialty profile not found" });
      return;
    }

    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// Delete a specialty profile
router.delete("/specialties/:id", async (req, res, next) => {
  try {
    const { id } = z.object({ id: z.string() }).parse(req.params);

    await db
      .delete(specialtyProfilesTable)
      .where(eq(specialtyProfilesTable.id, id));

    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
