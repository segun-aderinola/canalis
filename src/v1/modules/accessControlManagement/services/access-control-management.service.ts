import slugify from "slugify";
import logger from "@shared/utils/logger";
import { Response } from "express";
import httpStatus from "http-status";
import { ErrorResponse } from "@shared/utils/response.util";
import { injectable } from "tsyringe";
import PermissionRepo from "../repositories/permission.repo";
import RoleRepo from "../repositories/role.repo";
import { CreateRole } from "../dtos/create-role.dto";
import { IRole } from "../model/role.model";
import { IPermission } from "../model/permission.model";
import ServiceUnavailableError from "@shared/error/service-unavailable.error";

@injectable()
class AccessControlManagementService {
	constructor(
		private readonly roleRepo: RoleRepo,
		private readonly permissionRepo: PermissionRepo,
	) {}

	async createRole(data: CreateRole, reply: Response) {
		try {
			const existingRole = await this.roleRepo.findByName(data.name);
			if (existingRole) {
				return reply
					.status(httpStatus.CONFLICT)
					.send(ErrorResponse("Role already exists"));
			}

			const roleData = {
				name: data.name,
				description: data.description,
				slug: slugify(data.name, { lower: true }),
			};

			const rolePermissions = data.permissions.map((permission) => ({
				permissionId: permission,
			}));

			const relationsData = {
				role_permissions: rolePermissions,
			};

			const savedRole = await this.roleRepo.saveWithRelations(
				roleData,
				relationsData,
				"role_permissions",
				"roleId"
			);

			return savedRole;
		} catch (error: any) {
			logger.error(`Error creating role`);
			throw new ServiceUnavailableError();
		}
	}

	async getRole(id: string, reply: Response) {
		try {
			const role = await this.roleRepo.findById(id, ["permissions"]);
			if (!role) {
				return reply
					.status(httpStatus.NOT_FOUND)
					.send(ErrorResponse("Role not found"));
			}
			return role;
		} catch (error: any) {
			logger.error(`Error fetching role by ID`);
			throw new ServiceUnavailableError();
		}
	}

	async getAllRoles() {
		try {
			return await this.roleRepo.getAllWithRelations(["permissions"]);
		} catch (error: any) {
			logger.error(`Error fetching all roles`);
			throw new ServiceUnavailableError();
		}
	}

	async updateRole(id: string, data: CreateRole, reply: Response) {
		try {
			const existingRole: IRole = await this.roleRepo.findById(id);
			if (!existingRole) {
				return reply
					.status(httpStatus.NOT_FOUND)
					.send(ErrorResponse("Role not found"));
			}

			const updateData = {
				name: data.name,
				description: data.description,
				slug: slugify(data.name, { lower: true }),
			};

			const rolePermissions = data.permissions.map((permission) => ({
				roleId: id,
				permissionId: permission,
			}));

			return await this.roleRepo.updateWithRelations(
				id,
				updateData,
				{ role_permissions: rolePermissions },
				"role_permissions",
				"roleId"
			);
		} catch (error: any) {
			logger.error(`Error updating role`);
			throw new ServiceUnavailableError();
		}
	}

	async deleteRole(id: string, reply: Response) {
		try {

			const existingRole: IRole = await this.roleRepo.findById(id);
			if (!existingRole) {
				return reply
					.status(httpStatus.NOT_FOUND)
					.send(ErrorResponse("Role not found"));
			}

			const roleUsers: any = await this.roleRepo.findWhere({ id }, ["users"]);
			if (roleUsers.length > 0) {
				return reply
					.status(httpStatus.CONFLICT)
					.send(ErrorResponse("Role has users assigned to it"));
			}

			return await this.roleRepo.deleteWithRelations(id, "role_permissions", "roleId");
		} catch (error: any) {
			logger.error(`Error deleting role`);
			throw new ServiceUnavailableError();
		}
	}

	async getPermission(id: string, reply: Response) {
		try {
			const permission: IPermission = await this.permissionRepo.findById(id);
			if (!permission) {
				return reply
					.status(httpStatus.NOT_FOUND)
					.send(ErrorResponse("Permission not found"));
			}
			return permission;
		} catch (error: any) {
			logger.error(`Error fetching permission by ID`);
			throw new ServiceUnavailableError();
		}
	}

	async getAllPermissions() {
		try {
			const permissions: IPermission[] = await this.permissionRepo.getAll();
			return permissions;
		} catch (error: any) {
			logger.error(`Error fetching all permissions`);
			throw new ServiceUnavailableError();
		}
	}
}

export default AccessControlManagementService;
