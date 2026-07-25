import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { contentItemsTable } from "@workspace/db";
import {
  ListContentQueryParams,
  ListContentResponse,
  CreateContentBody,
  CreateContentResponse,
  GetContentParams,
  GetContentResponse,
  UpdateContentParams,
  UpdateContentBody,
  UpdateContentResponse,
  DeleteContentParams,
} from "@workspace/api-zod";
import { eq, and, like, or, arrayContains } from "drizzle-orm";
import { randomUUID } from "node:crypto";

const router: IRouter = Router();

router.get("/content", async (req, res, next) => {
  try {
    const params = ListContentQueryParams.parse(req.query);
    const conditions = [];

    if (params.status) {
      conditions.push(eq(contentItemsTable.status, params.status));
    }
    if (params.platform) {
      conditions.push(arrayContains(contentItemsTable.platform, [params.platform]));
    }
    if (params.campaign) {
      conditions.push(eq(contentItemsTable.campaign, params.campaign));
    }
    if (params.search) {
      conditions.push(
        or(
          like(contentItemsTable.title, `%${params.search}%`),
          like(contentItemsTable.body, `%${params.search}%`),
        ),
      );
    }

    const items = await db.query.contentItemsTable.findMany({
      where: conditions.length ? and(...conditions) : undefined,
      orderBy: (content, { desc }) => [desc(content.updatedAt)],
    });

    const data = ListContentResponse.parse({ items });
    res.json(data);
  } catch (err) {
    next(err);
  }
});

router.post("/content", async (req, res, next) => {
  try {
    const body = CreateContentBody.parse(req.body);
    const id = randomUUID();
    const now = new Date();

    const [inserted] = await db
      .insert(contentItemsTable)
      .values({
        id,
        ...body,
        scheduledFor: body.scheduledFor ? new Date(body.scheduledFor) : null,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    const data = CreateContentResponse.parse(inserted);
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
});

router.get("/content/:id", async (req, res, next) => {
  try {
    const params = GetContentParams.parse(req.params);
    const item = await db.query.contentItemsTable.findFirst({
      where: eq(contentItemsTable.id, params.id),
    });

    if (!item) {
      res.status(404).json({ error: "Content not found" });
      return;
    }

    const data = GetContentResponse.parse(item);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

router.patch("/content/:id", async (req, res, next) => {
  try {
    const params = UpdateContentParams.parse(req.params);
    const body = UpdateContentBody.parse(req.body);

    const updateBody = {
      ...body,
      scheduledFor: body.scheduledFor ? new Date(body.scheduledFor) : body.scheduledFor === null ? null : undefined,
      updatedAt: new Date(),
    };
    const [updated] = await db
      .update(contentItemsTable)
      .set(updateBody)
      .where(eq(contentItemsTable.id, params.id))
      .returning();

    if (!updated) {
      res.status(404).json({ error: "Content not found" });
      return;
    }

    const data = UpdateContentResponse.parse(updated);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

router.delete("/content/:id", async (req, res, next) => {
  try {
    const params = DeleteContentParams.parse(req.params);
    await db.delete(contentItemsTable).where(eq(contentItemsTable.id, params.id));
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
