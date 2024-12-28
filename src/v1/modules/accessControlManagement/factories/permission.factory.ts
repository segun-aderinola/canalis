import { CreatePermission } from "../dtos/create-permission.dto";
import { IPermission } from "../model/permission.model";

class PermissionFactory {
	static createPermission(data: CreatePermission) {
		const permission = {} as IPermission;

		permission.moduleId = data.moduleId;
		permission.name = data.name;
		permission.description = data.description;
		permission.action = data.action;
		permission.slug = data.slug;

		return permission;
	}

	static readPermissionDto(data: any) {
		const permission = {} as IPermission;

		permission.id = data.id;
		permission.name = data.name;
		permission.description = data.description;
		permission.action = data.action;
		permission.slug = data.slug;

		return permission;
	}

	static readPermissionsDto(data: any) {
		return data.length > 0 ? data.map((permission) => this.readPermissionDto(permission)) : [];
	}
}

export default PermissionFactory;
