import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import {
  contentItemsTable,
  publishingQueueItemsTable,
  publishingHistoryTable,
  platformConnectionsTable,
  approvalRecordsTable,
} from "@workspace/db";
import {
  GetDashboardSummaryResponse,
  GetRecentActivityQueryParams,
  GetRecentActivityResponse,
} from "@workspace/api-zod";
import { count, eq, sql } from "drizzle-orm";
import { z } from "zod/v4";

const router: IRouter = Router();

router.get("/dashboard", async (_req, res, next) => {
  try {
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const [contentCounts] = await db
      .select({
        total: count(),
        scheduledToday: sql<number>`count(*) filter (where ${contentItemsTable.scheduledFor} >= ${todayStart.toISOString()} and ${contentItemsTable.scheduledFor} < ${todayStart.toISOString()})`,
        draftCount: sql<number>`count(*) filter (where ${contentItemsTable.status} = 'draft')`,
      })
      .from(contentItemsTable);

    const [failedCount] = await db
      .select({ count: count() })
      .from(publishingHistoryTable)
      .where(eq(publishingHistoryTable.status, "failed"));

    const [pendingApprovals] = await db
      .select({ count: count() })
      .from(approvalRecordsTable)
      .where(eq(approvalRecordsTable.status, "needs_review"));

    const [platformCounts] = await db
      .select({
        total: count(),
        connected: sql<number>`count(*) filter (where ${platformConnectionsTable.connected} = true)`,
      })
      .from(platformConnectionsTable);

    const [queueCount] = await db
      .select({ count: count() })
      .from(publishingQueueItemsTable);

    const data = GetDashboardSummaryResponse.parse({
      todayPosts: contentCounts?.scheduledToday ?? 0,
      scheduledToday: contentCounts?.scheduledToday ?? 0,
      pendingApprovals: pendingApprovals?.count ?? 0,
      failedPosts: failedCount?.count ?? 0,
      connectedPlatforms: platformCounts?.connected ?? 0,
      totalPlatforms: platformCounts?.total ?? 0,
      queueSize: queueCount?.count ?? 0,
      draftCount: contentCounts?.draftCount ?? 0,
    });

    res.json(data);
  } catch (err) {
    next(err);
  }
});

router.get("/dashboard/activity", async (req, res, next) => {
  try {
    const params = GetRecentActivityQueryParams.parse(req.query);
    const limit = z.number().min(1).max(100).parse(params.limit ?? 20);

    const items = await db.query.publishingHistoryTable.findMany({
      orderBy: (history, { desc }) => [desc(history.publishedAt)],
      limit,
    });

    const mapped = items.map((item) => ({
      id: item.id,
      type: item.status === "failed" ? "failure" : "publish",
      title: item.title,
      description: item.error ?? `Published to ${item.platform}`,
      timestamp: item.publishedAt?.toISOString() ?? new Date().toISOString(),
      user: item.user,
      severity: item.status === "failed" ? "critical" : "low",
    }));

    const data = GetRecentActivityResponse.parse({ items: mapped });
    res.json(data);
  } catch (err) {
    next(err);
  }
});

export default router;
