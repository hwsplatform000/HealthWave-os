import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { alertsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { z } from "zod/v4";

const router: IRouter = Router();

// List all alerts
router.get("/alerts", async (req, res, next) => {
  try {
    const { type, severity, isRead, limit } = z.object({
      type: z.string().optional(),
      severity: z.string().optional(),
      isRead: z.string().optional(),
      limit: z.number().optional().default(20),
    }).parse(req.query);

    let query = db.query.alertsTable.findMany({
      orderBy: (alert, { desc }) => [desc(alert.createdAt)],
      limit: limit || 20,
    });

    const items = await query;
    let filtered = items;

    if (type) {
      filtered = filtered.filter(a => a.type === type);
    }

    if (severity) {
      filtered = filtered.filter(a => a.severity === severity);
    }

    if (isRead !== undefined) {
      const isReadBool = isRead === "true";
      filtered = filtered.filter(a => a.isRead === isReadBool);
    }

    res.json({ items: filtered });
  } catch (err) {
    next(err);
  }
});

// Create a new alert
router.post("/alerts", async (req, res, next) => {
  try {
    const body = z.object({
      title: z.string().min(1),
      description: z.string().optional(),
      type: z.enum(["trend", "ai_tool", "platform", "algorithm", "research_update", "competitor", "compliance", "verification"]),
      severity: z.enum(["info", "warning", "critical"]).optional().default("info"),
      category: z.string().optional(),
      metadata: z.record(z.any()).optional(),
      actionUrl: z.string().optional(),
    }).parse(req.body);

    const id = randomUUID();

    const [inserted] = await db
      .insert(alertsTable)
      .values({
        id,
        ...body,
        isRead: false,
        isArchived: false,
      })
      .returning();

    res.status(201).json(inserted);
  } catch (err) {
    next(err);
  }
});

// Get specific alert
router.get("/alerts/:id", async (req, res, next) => {
  try {
    const { id } = z.object({ id: z.string() }).parse(req.params);

    const item = await db.query.alertsTable.findFirst({
      where: eq(alertsTable.id, id),
    });

    if (!item) {
      res.status(404).json({ error: "Alert not found" });
      return;
    }

    res.json(item);
  } catch (err) {
    next(err);
  }
});

// Mark alert as read
router.patch("/alerts/:id/read", async (req, res, next) => {
  try {
    const { id } = z.object({ id: z.string() }).parse(req.params);

    const [updated] = await db
      .update(alertsTable)
      .set({
        isRead: true,
        readAt: new Date(),
      })
      .where(eq(alertsTable.id, id))
      .returning();

    if (!updated) {
      res.status(404).json({ error: "Alert not found" });
      return;
    }

    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// Archive alert
router.patch("/alerts/:id/archive", async (req, res, next) => {
  try {
    const { id } = z.object({ id: z.string() }).parse(req.params);

    const [updated] = await db
      .update(alertsTable)
      .set({
        isArchived: true,
      })
      .where(eq(alertsTable.id, id))
      .returning();

    if (!updated) {
      res.status(404).json({ error: "Alert not found" });
      return;
    }

    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// Delete alert
router.delete("/alerts/:id", async (req, res, next) => {
  try {
    const { id } = z.object({ id: z.string() }).parse(req.params);

    await db
      .delete(alertsTable)
      .where(eq(alertsTable.id, id));

    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
