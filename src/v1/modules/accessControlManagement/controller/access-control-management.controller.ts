import httpStatus from "http-status";
import { SuccessResponse } from "@shared/utils/response.util";
import { Request, Response } from "express";
import { injectable } from "tsyringe";
import AccessControlManagementService from "../services/access-control-management.service";

@injectable()
class AccessControlManagementController {
	constructor(
		private readonly accessControlManagementService: AccessControlManagementService
	) {}

	createRole = async (req: Request, res: Response) => {
		const role: any = await this.accessControlManagementService.createRole(
			req.body,
			res
		);

		return res
			.status(httpStatus.CREATED)
			.send(SuccessResponse("Role created successfully", role));
	};

	updateRole = async (req: Request, res: Response) => {
		const role: any = await this.accessControlManagementService.updateRole(
			req.params.id,
			req.body,
			res
		);

		return res.status(httpStatus.OK).send(SuccessResponse("Role updated successfully", role));
	};

	getRole = async (req: Request, res: Response) => {
		const role: any = await this.accessControlManagementService.getRole(
			req.params.id,
			res
		);

		return res
			.status(httpStatus.OK)
			.send(SuccessResponse("Role fetched successfully", role));
	};

	getAllRoles = async (req: Request, res: Response) => {
		const roles: any = await this.accessControlManagementService.getAllRoles();

		return res
			.status(httpStatus.OK)
			.send(SuccessResponse("Role fetched successfully", roles));
	};

	deleteRole = async (req: Request, res: Response) => {
		await this.accessControlManagementService.deleteRole(req.params.id, res);

		return res.status(httpStatus.NO_CONTENT).send(SuccessResponse("Role deleted successfully"));
	};

	getPermission = async (req: Request, res: Response) => {
		const permission: any =
			await this.accessControlManagementService.getPermission(req.params.id, res);

		return res.status(httpStatus.OK).send(SuccessResponse("Permission fetched successful", permission));
	};

	getAllPermissions = async (req: Request, res: Response) => {
		const permissions: any =
			await this.accessControlManagementService.getAllPermissions();

		return res
			.status(httpStatus.OK)
			.send(SuccessResponse("Permissions fetched successful", permissions));
	};
}

export default AccessControlManagementController;
