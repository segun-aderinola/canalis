import express, { Request, Response } from "express";
import { container } from "tsyringe";
import validate from "@shared/middlewares/validator.middleware";
import AccessControlManagementController from "../controller/access-control-management.controller";
import {
	createRoleRules,
	updateRoleRules,
	getRoleRules,
  deleteRoleRules,
} from "../validations/access-control.validator";
import accessControlMiddleware from "@shared/middlewares/access-control.middleware";
import { AccessControls } from "..//enums/access-control.enum";

const accessControlManagementController = container.resolve(
	AccessControlManagementController
);
const router = express.Router();

router.post(
	"/admin/roles",
	validate(createRoleRules),
	accessControlMiddleware(AccessControls.ROLE_CREATION),
	(req: Request, res: Response) => {
		accessControlManagementController.createRole(req, res);
	}
);

router.get(
	"/admin/roles/:id",
	validate(getRoleRules),
	accessControlMiddleware(AccessControls.ROLE_LIST),
	(req: Request, res: Response) => {
		accessControlManagementController.getRole(req, res);
	}
);

router.get(
	"/admin/roles",
	accessControlMiddleware(AccessControls.ROLE_LIST),
	(req: Request, res: Response) => {
		accessControlManagementController.getAllRoles(req, res);
	}
);

router.put(
	"/admin/roles/:id",
	validate(updateRoleRules),
	accessControlMiddleware(AccessControls.ROLE_UPDATE),
	(req: Request, res: Response) => {
		accessControlManagementController.updateRole(req, res);
	}
);

router.delete(
	"/admin/roles/:id",
	validate(deleteRoleRules),
	accessControlMiddleware(AccessControls.ROLE_DELETION),
	(req: Request, res: Response) => {
		accessControlManagementController.deleteRole(req, res);
	}
);

router.get(
	"/admin/permissions/:id",
	(req: Request, res: Response) => {
		accessControlManagementController.getPermission(req, res);
	}
);

router.get("/admin/permissions", (req: Request, res: Response) => {
	accessControlManagementController.getAllPermissions(req, res);
});

export default router;
