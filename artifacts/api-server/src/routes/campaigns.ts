import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { campaignsTable } from "@workspace/db";
import { ListCampaignsResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/campaigns", async (_req, res, next) => {
  try {
    const items = await db.query.campaignsTable.findMany({
      orderBy: (campaign, { desc }) => [desc(campaign.startDate)],
    });

    const data = ListCampaignsResponse.parse({ items });
    res.json(data);
  } catch (err) {
    next(err);
  }
});

export default router;
