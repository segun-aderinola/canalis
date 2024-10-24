// import { ObjectLiteral } from "@shared/types/object-literal.type";
import { CreateRolePermission } from "../dtos/create-role-permission.dto";
import { IRolePermission } from "../model/role-permission.model";

class RolePermissionFactory {
	static createRolePermission(data: CreateRolePermission) {
		const rolePermission = {} as IRolePermission;

		rolePermission.roleId = data.roleId ?? "";
		rolePermission.permissionId = data.permissionId;

		return rolePermission;
	}
}

export default RolePermissionFactory;
