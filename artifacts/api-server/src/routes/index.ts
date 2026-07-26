import { Router, type IRouter } from "express";
import healthRouter from "./health";
import dashboardRouter from "./dashboard";
import contentRouter from "./content";
import publishingRouter from "./publishing";
import platformsRouter from "./platforms";
import platformGroupsRouter from "./platform-groups";
import publishingRulesRouter from "./publishing-rules";
import campaignsRouter from "./campaigns";
import approvalsRouter from "./approvals";
import historyRouter from "./history";
import notificationsRouter from "./notifications";

const router: IRouter = Router();

router.use(healthRouter);
router.use(dashboardRouter);
router.use(contentRouter);
router.use(publishingRouter);
router.use(platformsRouter);
router.use(platformGroupsRouter);
router.use(publishingRulesRouter);
router.use(campaignsRouter);
router.use(approvalsRouter);
router.use(historyRouter);
router.use(notificationsRouter);

export default router;
