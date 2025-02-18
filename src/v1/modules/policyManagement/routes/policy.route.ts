import express, { Response, Request } from "express";
import { container } from "tsyringe";
import PolicyController from "../controller/policy.controller";
import NotificationController from "../controller/notification.controller";
import { validate } from "@shared/middlewares/validator.middleware";
import { policyValidationRules } from "../validations/policy.validator";
import { policyCallbackValidationRules } from "../validations/callback.validator";
import accessControlMiddleware from "@shared/middlewares/access-control.middleware";
import { AccessControls } from "../../accessControlManagement/enums/access-control.enum";
import authMiddleware from "@shared/middlewares/auth.middleware";
import PolicyBeneficiaryController from "../controller/policy_beneficiary.controller";
import { policyBulkBeneficiariesValidationRules } from "../validations/policy_multiple_beneficiary.validator";

const policyController = container.resolve(PolicyController);
const notificationController = container.resolve(NotificationController);
const policyBeneficiaryController = container.resolve(PolicyBeneficiaryController);

const router = express.Router();


router.get("/policy", [
  authMiddleware,
  accessControlMiddleware(AccessControls.POLICY_LIST)
], 
  (req: Request, res: Response) => {
  policyController.getAll(req,res);
});

router.post("/policy", validate(policyValidationRules), [authMiddleware, accessControlMiddleware(AccessControls.POLICY_CREATION)], (req: Request, res: Response) => {
  policyController.createPolicy(req, res);
});

router.get("/policy/:id", [authMiddleware, accessControlMiddleware(AccessControls.POLICY_LIST)], (req: Request, res: Response) => {
  policyController.getSinglePolicy(req, res);
});

router.post("/policy/approve/:id", [authMiddleware, accessControlMiddleware(AccessControls.POLICY_APPROVAL)], (req:Request, res: Response) => {
  policyController.approvePolicy(req, res);
});

router.post("/policy/reject/:id", [authMiddleware, accessControlMiddleware(AccessControls.POLICY_REJECTION)], (req:Request, res: Response) => {
  policyController.rejectPolicy(req, res);
});

router.get("/policy/agent/:id", [authMiddleware, accessControlMiddleware(AccessControls.POLICY_LIST)], (req: Request, res: Response) => {
  policyController.getPolicyByAgent(req, res);
});

router.get("/policy/supervisor/:id", [authMiddleware, accessControlMiddleware(AccessControls.POLICY_LIST)], (req: Request, res: Response) => {
  policyController.getPolicyBySupervisor(req, res);
});

router.get("/notification", [authMiddleware], (req: Request, res: Response) => {
  notificationController.getAllNotifications(req, res);
});

router.post("/policy/callback", validate(policyCallbackValidationRules), (req: Request, res: Response) => {
  policyController.creationCallback(req, res);
});

router.post("/policy/add-beneficiaries/:id", authMiddleware, accessControlMiddleware(AccessControls.POLICY_CREATION), validate(policyBulkBeneficiariesValidationRules), (req: Request, res: Response) => {
  policyBeneficiaryController.addPolicyBeneficiary(req, res);
});

router.get("/policy/beneficiaries/:id", authMiddleware, accessControlMiddleware(AccessControls.POLICY_LIST), (req: Request, res: Response) => {
  policyBeneficiaryController.getBeneficiaryDetails(req, res);
});

router.get("/policy/:id", authMiddleware, (req: Request, res: Response) => {
  policyController.getSinglePolicy(req, res);
});

export default router;
