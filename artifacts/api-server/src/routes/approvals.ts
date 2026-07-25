import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { approvalRecordsTable } from "@workspace/db";
import {
  ListApprovalsQueryParams,
  ListApprovalsResponse,
  ApproveContentParams,
  ApproveContentBody,
  ApproveContentResponse,
} from "@workspace/api-zod";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

router.get("/approvals", async (req, res, next) => {
  try {
    const params = ListApprovalsQueryParams.parse(req.query);
    const where = params.status ? eq(approvalRecordsTable.status, params.status) : undefined;

    const items = await db.query.approvalRecordsTable.findMany({
      where,
      orderBy: (record, { desc }) => [desc(record.timestamp)],
    });

    const data = ListApprovalsResponse.parse({
      items: items.map((item) => ({
        ...item,
        comments: [],
      })),
    });
    res.json(data);
  } catch (err) {
    next(err);
  }
});

router.post("/approvals/:id/approve", async (req, res, next) => {
  try {
    const params = ApproveContentParams.parse(req.params);
    const body = ApproveContentBody.parse(req.body);

    const [updated] = await db
      .update(approvalRecordsTable)
      .set({
        status: "approved",
        note: body.note,
        timestamp: new Date(),
      })
      .where(eq(approvalRecordsTable.id, params.id))
      .returning();

    if (!updated) {
      res.status(404).json({ error: "Approval not found" });
      return;
    }

    const data = ApproveContentResponse.parse({
      ...updated,
      comments: [],
    });
    res.json(data);
  } catch (err) {
    next(err);
  }
});

export default router;
