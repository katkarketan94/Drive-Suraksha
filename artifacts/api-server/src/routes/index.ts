import { Router, type IRouter } from "express";
import healthRouter from "./health";
import eventsRouter from "./events";
import scoreRouter from "./score";
import routeRouter from "./route";
import cityRouter from "./city";
import demoRouter from "./demo";

const router: IRouter = Router();

router.use(healthRouter);
router.use(eventsRouter);
router.use(scoreRouter);
router.use(routeRouter);
router.use(cityRouter);
router.use(demoRouter);

export default router;
