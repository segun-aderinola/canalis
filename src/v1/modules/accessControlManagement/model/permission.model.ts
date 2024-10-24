import { DB_TABLES } from "@shared/enums/db-tables.enum";
import { Model, ModelObject } from "objection";

export class Permission extends Model {
	static tableName = DB_TABLES.PERMISSIONS;
	id: string;
	moduleId: string;
	name: string;
	description: string;
	action: string;
	slug: string;
	createdAt: Date;
	updatedAt: Date;
}

export type IPermission = ModelObject<Permission>;
