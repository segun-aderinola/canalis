import express, { Response, Request } from "express";
import { container } from "tsyringe";
import PolicyController from "../controller/policy.controller";
import authMiddleware from "@shared/middlewares/auth.middleware";
import NotificationController from "../controller/notification.controller";
import { validate } from "@shared/middlewares/validator.middleware";
import { policyValidationRules } from "../validations/policy.validator";
import { policyCallbackValidationRules } from "../validations/callback.validator";

const policyController = container.resolve(PolicyController);
const notificationController = container.resolve(NotificationController);
const router = express.Router();

router.get("/policy", authMiddleware, (req: Request, res: Response) => {
  policyController.getAll(req,res);
});

router.post("/policy", validate(policyValidationRules), authMiddleware, (req: Request, res: Response) => {
  policyController.createPolicy(req, res);
});

router.get("/policy/:id", authMiddleware, (req: Request, res: Response) => {
  policyController.getSinglePolicy(req, res);
});

router.post("/policy/approve/:id", authMiddleware, (req:Request, res: Response) => {
  policyController.approvePolicy(req, res);
});

router.post("/policy/reject/:id", authMiddleware, (req:Request, res: Response) => {
  policyController.rejectPolicy(req, res);
});

router.get("/policy/agent/:id", authMiddleware, (req: Request, res: Response) => {
  policyController.getPolicyByAgent(req, res);
});

router.get("/policy/supervisor/:id", authMiddleware, (req: Request, res: Response) => {
  policyController.getPolicyBySupervisor(req, res);
});

router.get("/notification", authMiddleware, (req: Request, res: Response) => {
  notificationController.getAllNotifications(req, res);
});

router.post("/policy/callback", validate(policyCallbackValidationRules), (req: Request, res: Response) => {
  policyController.creationCallback(req, res);
});


export default router;
