// import { ObjectLiteral } from "@shared/types/object-literal.type";
import { CreateRole } from "../dtos/create-role.dto";
import { IRole } from "../model/role.model";

class RoleFactory {
	static createRole(data: CreateRole) {
		const role = {} as IRole;

    role.name = data.name;
    role.description = data.description;
    role.slug = data.slug;

    return role;
	}
}

export default RoleFactory;
