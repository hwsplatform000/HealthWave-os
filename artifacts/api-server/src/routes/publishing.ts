import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import {
  publishingQueueItemsTable,
  scheduledPostsTable,
} from "@workspace/db";
import {
  GetPublishingQueueResponse,
  ReorderQueueItemParams,
  ReorderQueueItemBody,
  ReorderQueueItemResponse,
  PauseQueueItemParams,
  PauseQueueItemResponse,
  ResumeQueueItemParams,
  ResumeQueueItemResponse,
  GetScheduledPostsQueryParams,
  GetScheduledPostsResponse,
  UpdateScheduledPostParams,
  UpdateScheduledPostBody,
  UpdateScheduledPostResponse,
  CancelScheduledPostParams,
} from "@workspace/api-zod";
import { eq, and, gte, lte, asc, desc } from "drizzle-orm";

const router: IRouter = Router();

router.get("/publishing/queue", async (_req, res, next) => {
  try {
    const items = await db.query.publishingQueueItemsTable.findMany({
      orderBy: (queue, { asc: ascFn, desc: descFn }) => [ascFn(queue.order), descFn(queue.priority)],
    });

    const paused = items.some((item) => item.paused);

    const data = GetPublishingQueueResponse.parse({
      items: items.map((item) => ({
        ...item,
        order: item.order,
      })),
      paused,
    });
    res.json(data);
  } catch (err) {
    next(err);
  }
});

router.patch("/publishing/queue/:id/reorder", async (req, res, next) => {
  try {
    const params = ReorderQueueItemParams.parse(req.params);
    const body = ReorderQueueItemBody.parse(req.body);

    const [updated] = await db
      .update(publishingQueueItemsTable)
      .set({ order: body.order })
      .where(eq(publishingQueueItemsTable.id, params.id))
      .returning();

    if (!updated) {
      res.status(404).json({ error: "Queue item not found" });
      return;
    }

    const data = ReorderQueueItemResponse.parse(updated);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

router.post("/publishing/queue/:id/pause", async (req, res, next) => {
  try {
    const params = PauseQueueItemParams.parse(req.params);
    const [updated] = await db
      .update(publishingQueueItemsTable)
      .set({ paused: true, status: "paused" })
      .where(eq(publishingQueueItemsTable.id, params.id))
      .returning();

    if (!updated) {
      res.status(404).json({ error: "Queue item not found" });
      return;
    }

    const data = PauseQueueItemResponse.parse(updated);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

router.post("/publishing/queue/:id/resume", async (req, res, next) => {
  try {
    const params = ResumeQueueItemParams.parse(req.params);
    const [updated] = await db
      .update(publishingQueueItemsTable)
      .set({ paused: false, status: "queued" })
      .where(eq(publishingQueueItemsTable.id, params.id))
      .returning();

    if (!updated) {
      res.status(404).json({ error: "Queue item not found" });
      return;
    }

    const data = ResumeQueueItemResponse.parse(updated);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

router.get("/publishing/schedule", async (req, res, next) => {
  try {
    const params = GetScheduledPostsQueryParams.parse(req.query);
    const conditions = [];

    if (params.start) {
      conditions.push(gte(scheduledPostsTable.scheduledFor, new Date(params.start)));
    }
    if (params.end) {
      conditions.push(lte(scheduledPostsTable.scheduledFor, new Date(params.end)));
    }

    const items = await db.query.scheduledPostsTable.findMany({
      where: conditions.length ? and(...conditions) : undefined,
      orderBy: (post, { asc }) => [asc(post.scheduledFor)],
    });

    const data = GetScheduledPostsResponse.parse({ items });
    res.json(data);
  } catch (err) {
    next(err);
  }
});

router.patch("/publishing/schedule/:id", async (req, res, next) => {
  try {
    const params = UpdateScheduledPostParams.parse(req.params);
    const body = UpdateScheduledPostBody.parse(req.body);

    const updateBody = {
      ...body,
      scheduledFor: body.scheduledFor ? new Date(body.scheduledFor) : undefined,
    };
    const [updated] = await db
      .update(scheduledPostsTable)
      .set(updateBody)
      .where(eq(scheduledPostsTable.id, params.id))
      .returning();

    if (!updated) {
      res.status(404).json({ error: "Scheduled post not found" });
      return;
    }

    const data = UpdateScheduledPostResponse.parse(updated);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

router.delete("/publishing/schedule/:id", async (req, res, next) => {
  try {
    const params = CancelScheduledPostParams.parse(req.params);
    await db
      .delete(scheduledPostsTable)
      .where(eq(scheduledPostsTable.id, params.id));
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
