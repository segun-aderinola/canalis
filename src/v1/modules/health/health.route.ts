import express, { Request, Response } from "express";
import { container } from "tsyringe";
import HealthController from "./health.controller";

const healthController = container.resolve(HealthController);
const router = express.Router();

router.get("/readyz", (req: Request, res: Response) => {
  healthController.readinessCheck(req, res);
});

router.get("/livez", (req: Request, res: Response) => {
  healthController.livelinessCheck(req, res);
});

export default router;
