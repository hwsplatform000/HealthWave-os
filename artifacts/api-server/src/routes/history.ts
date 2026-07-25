import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { publishingHistoryTable } from "@workspace/db";
import {
  GetPublishingHistoryQueryParams,
  GetPublishingHistoryResponse,
} from "@workspace/api-zod";
import { desc } from "drizzle-orm";
import { z } from "zod/v4";

const router: IRouter = Router();

router.get("/history", async (req, res, next) => {
  try {
    const params = GetPublishingHistoryQueryParams.parse(req.query);
    const limit = z.number().min(1).max(200).parse(params.limit ?? 50);

    const items = await db.query.publishingHistoryTable.findMany({
      orderBy: desc(publishingHistoryTable.publishedAt),
      limit,
    });

    const data = GetPublishingHistoryResponse.parse({ items });
    res.json(data);
  } catch (err) {
    next(err);
  }
});

export default router;
