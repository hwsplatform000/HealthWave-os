import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { notificationsTable } from "@workspace/db";
import {
  ListNotificationsQueryParams,
  ListNotificationsResponse,
  MarkNotificationsReadBody,
} from "@workspace/api-zod";
import { eq, inArray, count } from "drizzle-orm";

const router: IRouter = Router();

router.get("/notifications", async (req, res, next) => {
  try {
    const params = ListNotificationsQueryParams.parse(req.query);
    const where = params.unreadOnly ? eq(notificationsTable.read, false) : undefined;

    const items = await db.query.notificationsTable.findMany({
      where,
      orderBy: (notification, { desc }) => [desc(notification.timestamp)],
    });

    const [unreadCount] = await db
      .select({ count: count() })
      .from(notificationsTable)
      .where(eq(notificationsTable.read, false));

    const data = ListNotificationsResponse.parse({
      items: items.map((item) => ({
        ...item,
        action:
          item.actionLabel && item.actionHref
            ? { label: item.actionLabel, href: item.actionHref }
            : null,
      })),
      unreadCount: unreadCount?.count ?? 0,
    });
    res.json(data);
  } catch (err) {
    next(err);
  }
});

router.patch("/notifications", async (req, res, next) => {
  try {
    const body = MarkNotificationsReadBody.parse(req.body);
    await db
      .update(notificationsTable)
      .set({ read: true })
      .where(inArray(notificationsTable.id, body.ids));
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

export default router;
