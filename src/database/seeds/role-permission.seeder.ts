import { DB_TABLES } from "../../shared/enums/db-tables.enum";
import { Knex } from "knex";
import bcrypt from "bcrypt";

export async function seed(knex: Knex): Promise<void> {
	// Clear all tables first (in reverse order of dependencies)
	await knex(DB_TABLES.USERS).del();
	await knex(DB_TABLES.ROLE_PERMISSIONS).del();
	await knex(DB_TABLES.ROLES).del();
	await knex(DB_TABLES.PERMISSIONS).del();

	// Insert into permission table WITH ID
	await knex(DB_TABLES.PERMISSIONS).insert([
		{
			id: "4ad43ccb-512b-409e-8bf6-95fd0ea0d9e2", // Make sure to include the ID
			moduleId: "4ad43ccb-512b-409e-8bf6-95fd0ea0d9e2",
			name: "bulk_user_onboarding",
			description: "Allows bulk user onboarding.",
			action: "can_bulk_onboard_user",
			slug: "bulk_user_onboarding",
		},
	]);

	// Insert into roles table
	await knex(DB_TABLES.ROLES).insert([
		{
			id: "5bd43ccb-512d-409e-8bf6-95fd0ea0d9e8",
			name: "Super Admin",
			description: "user with super privilegs",
			slug: "super-admin",
		},
	]);

	// Insert into role_permissions table
	await knex(DB_TABLES.ROLE_PERMISSIONS).insert([
		{
			id: "1fd43ccb-512d-409e-8bf6-95fd0ea0d9b2",
			roleId: "5bd43ccb-512d-409e-8bf6-95fd0ea0d9e8",
			permissionId: "4ad43ccb-512b-409e-8bf6-95fd0ea0d9e2",
		},
	]);

	// Insert into users table
	await knex(DB_TABLES.USERS).insert([
		{
			id: "6cd43ccb-512d-409e-8bf6-95fd0ea0d9f3",
			name: "John Doe",
			email: "john.doe@example.com",
			phoneNumber: "1234567890",
			password: await bcrypt.hash("password", 10),
			avatar: null,
			address: "123 Main St",
			roleId: "5bd43ccb-512d-409e-8bf6-95fd0ea0d9e8",
			supervisorId: "7ed43ccb-512d-409e-8bf6-95fd0ea0d9f4",
			region: "North",
			isDefaultPassword: true,
			status: "active",
			signature: null,
		},
	]);
}
