import express, { Request, Response } from "express";
import { container } from "tsyringe";
import AuditTrailController from "../controller/audit-trail.controller";

const auditTrailController = container.resolve(AuditTrailController);
const router = express.Router();

router.get("/audit-trails", (req: Request, res: Response) => {
  auditTrailController.getAll(req, res);
});

export default router;
