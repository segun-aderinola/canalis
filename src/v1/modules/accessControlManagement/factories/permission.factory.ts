// import { ObjectLiteral } from "@shared/types/object-literal.type";
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
}

export default PermissionFactory;
