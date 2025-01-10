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
			id: "4ad43ccb-512b-409e-8bf6-95fd0ea0d9e2",
			moduleId: "4ad43ccb-512b-409e-8bf6-95fd0ea0d9e2",
			name: "bulk_user_onboarding",
			description: "Allows bulk user onboarding.",
			action: "can_bulk_onboard_user",
			slug: "bulk_user_onboarding",
		},
		{
			id: "4ad43ccb-512b-409e-8bf6-95fd0ea0d9e3",
			moduleId: "4ad43ccb-512b-409e-8bf6-95fd0ea0d9e2",
			name: "user_onboarding",
			description: "Allows user onboarding.",
			action: "can_onboard_user",
			slug: "user_onboarding",
		},
		{
			id: "4ad43ccb-512b-409e-8bf6-95fd0ea0d9e4",
			moduleId: "4ad43ccb-512b-409e-8bf6-95fd0ea0d9e2",
			name: "user_list",
			description: "Allows viewing the user list.",
			action: "can_view_user_list",
			slug: "user_list",
		},
		{
			id: "4ad43ccb-512b-409e-8bf6-95fd0ea0d9e5",
			moduleId: "4ad43ccb-512b-409e-8bf6-95fd0ea0d9e2",
			name: "user_account_deactivation",
			description: "Allows deactivating user accounts.",
			action: "can_deactivate_user_account",
			slug: "user_account_deactivation",
		},
		{
			id: "4ad43ccb-512b-409e-8bf6-95fd0ea0d9e6",
			moduleId: "4ad43ccb-512b-409e-8bf6-95fd0ea0d9e2",
			name: "user_account_reactivation",
			description: "Allows reactivating user accounts.",
			action: "can_reactivate_user_account",
			slug: "user_account_reactivation",
		},
		{
			id: "4ad43ccb-512b-409e-8bf6-95fd0ea0d9e7",
			moduleId: "4ad43ccb-512b-409e-8bf6-95fd0ea0d9e2",
			name: "user_profile_update",
			description: "Allows updating user profiles.",
			action: "can_update_user_profile",
			slug: "user_profile_update",
		},
		{
			id: "4ad43ccb-512b-409e-8bf6-95fd0ea0d9e8",
			moduleId: "4ad43ccb-512b-409e-8bf6-95fd0ea0d9e2",
			name: "user_password_reset",
			description: "Allows resetting user passwords.",
			action: "can_reset_user_password",
			slug: "user_password_reset",
		},
		{
			id: "4ad43ccb-512b-409e-8bf6-95fd0ea0d9e9",
			moduleId: "1fd43ccb-512e-409e-8bf6-95fd0ea0d9e3",
			name: "role_creation",
			description: "Allows creating roles.",
			action: "can_create_role",
			slug: "role_creation",
		},
		{
			id: "4ad43ccb-512b-409e-8bf6-95fd0ea0d9ea",
			moduleId: "1fd43ccb-512e-409e-8bf6-95fd0ea0d9e3",
			name: "role_list",
			description: "Allows viewing the role list.",
			action: "can_view_role_list",
			slug: "role_list",
		},
		{
			id: "4ad43ccb-512b-409e-8bf6-95fd0ea0d9eb",
			moduleId: "1fd43ccb-512e-409e-8bf6-95fd0ea0d9e3",
			name: "role_update",
			description: "Allows updating roles.",
			action: "can_update_role",
			slug: "role_update",
		},
		{
			id: "4ad43ccb-512b-409e-8bf6-95fd0ea0d9ec",
			moduleId: "1fd43ccb-512e-409e-8bf6-95fd0ea0d9e3",
			name: "role_deletion",
			description: "Allows deleting roles.",
			action: "can_delete_role",
			slug: "role_deletion",
		},
		{
			id: "1bd43ccb-512b-409e-8bf6-95fd0ea0d3aa",
			moduleId: "1fd43ccb-512e-409e-8bf6-95fd0ea0d9e3",
			name: "role_assignment",
			description: "Allows roles assignment.",
			action: "can_assign_role",
			slug: "role_assignment",
		},
		{
			id: "4ad43ccb-512b-409e-8bf6-95fd0ea0d9ed",
			moduleId: "3fd43ccb-512e-409e-8bf6-95fd0ea0d9e3",
			name: "policy_creation",
			description: "Allows creating policies.",
			action: "can_create_policy",
			slug: "policy_creation",
		},
		{
			id: "4ad43ccb-512b-409e-8bf6-95fd0ea0d9ee",
			moduleId: "3fd43ccb-512e-409e-8bf6-95fd0ea0d9e3",
			name: "policy_list",
			description: "Allows viewing the policy list.",
			action: "can_view_policy_list",
			slug: "policy_list",
		},
		{
			id: "4ad43ccb-512b-409e-8bf6-95fd0ea0d9ef",
			moduleId: "3fd43ccb-512e-409e-8bf6-95fd0ea0d9e3",
			name: "policy_approval",
			description: "Allows approving policies.",
			action: "can_approve_policy",
			slug: "policy_approval",
		},
		{
			id: "4ad43ccb-512b-409e-8bf6-95fd0ea0d9f0",
			moduleId: "3fd43ccb-512e-409e-8bf6-95fd0ea0d9e3",
			name: "policy_rejection",
			description: "Allows rejecting policies.",
			action: "can_reject_policy",
			slug: "policy_rejection",
		},
		{
			id: "4ad43ccb-512b-409e-8bf6-95fd0ea0d9f1",
			moduleId: "8fd43ccb-512e-409e-8bf6-96fd0ea0d9e3",
			name: "product_creation",
			description: "Allows creating products.",
			action: "can_create_product",
			slug: "product_creation",
		},
		{
			id: "4ad43ccb-512b-409e-8bf6-95fd0ea0d9f2",
			moduleId: "8fd43ccb-512e-409e-8bf6-96fd0ea0d9e3",
			name: "product_list",
			description: "Allows viewing the product list.",
			action: "can_view_product_list",
			slug: "product_list",
		},
		{
			id: "4ad43ccb-512b-409e-8bf6-95fd0ea0d9f3",
			moduleId: "2fd43ccb-512e-409e-8bf6-95fd0ea0d9e3",
			name: "quotes_creation",
			description: "Allows creating quotes.",
			action: "can_create_quotes",
			slug: "quotes_creation",
		},
		{
			id: "4ad43ccb-512b-409e-8bf6-95fd0ea0d9f4",
			moduleId: "2fd43ccb-512e-409e-8bf6-95fd0ea0d9e3",
			name: "quotes_list",
			description: "Allows viewing the quotes list.",
			action: "can_view_quotes_list",
			slug: "quotes_list",
		},
	]);

	// Insert into roles table
	await knex(DB_TABLES.ROLES).insert([
		{
			id: "5bd43ccb-512d-409e-8bf6-95fd0ea0d9e8",
			name: "Super Admin",
			description: "user with super privilegs",
			slug: "super_admin",
		},
	]);

	// Insert into role_permissions table
	await knex(DB_TABLES.ROLE_PERMISSIONS).insert([
		{
			id: "1fd43ccb-512d-409e-8bf6-95fd0ea0d9b2",
			roleId: "5bd43ccb-512d-409e-8bf6-95fd0ea0d9e8",
			permissionId: "4ad43ccb-512b-409e-8bf6-95fd0ea0d9e2",
		},
		{
			id: "2fd43ccb-512d-409e-8bf6-95fd0ea0d9b3",
			roleId: "5bd43ccb-512d-409e-8bf6-95fd0ea0d9e8",
			permissionId: "4ad43ccb-512b-409e-8bf6-95fd0ea0d9e3",
		},
		{
			id: "3fd43ccb-512d-409e-8bf6-95fd0ea0d9b4",
			roleId: "5bd43ccb-512d-409e-8bf6-95fd0ea0d9e8",
			permissionId: "4ad43ccb-512b-409e-8bf6-95fd0ea0d9e4",
		},
		{
			id: "4fd43ccb-512d-409e-8bf6-95fd0ea0d9b2",
			roleId: "5bd43ccb-512d-409e-8bf6-95fd0ea0d9e8",
			permissionId: "4ad43ccb-512b-409e-8bf6-95fd0ea0d9e5",
		},
		{
			id: "5fd43ccb-512d-409e-8bf6-95fd0ea0d9b2",
			roleId: "5bd43ccb-512d-409e-8bf6-95fd0ea0d9e8",
			permissionId: "4ad43ccb-512b-409e-8bf6-95fd0ea0d9e6",
		},
		{
			id: "6fd43ccb-512d-409e-8bf6-95fd0ea0d9b2",
			roleId: "5bd43ccb-512d-409e-8bf6-95fd0ea0d9e8",
			permissionId: "4ad43ccb-512b-409e-8bf6-95fd0ea0d9e7",
		},
		{
			id: "7fd43ccb-512d-409e-8bf6-95fd0ea0d9b2",
			roleId: "5bd43ccb-512d-409e-8bf6-95fd0ea0d9e8",
			permissionId: "4ad43ccb-512b-409e-8bf6-95fd0ea0d9e8",
		},
		{
			id: "8fd43ccb-512d-409e-8bf6-95fd0ea0d9b2",
			roleId: "5bd43ccb-512d-409e-8bf6-95fd0ea0d9e8",
			permissionId: "4ad43ccb-512b-409e-8bf6-95fd0ea0d9e9",
		},
		{
			id: "9fd43ccb-512d-409e-8bf6-95fd0ea0d9b2",
			roleId: "5bd43ccb-512d-409e-8bf6-95fd0ea0d9e8",
			permissionId: "4ad43ccb-512b-409e-8bf6-95fd0ea0d9ea",
		},
		{
			id: "0fd43ccb-512d-409e-8bf6-95fd0ea0d9b2",
			roleId: "5bd43ccb-512d-409e-8bf6-95fd0ea0d9e8",
			permissionId: "4ad43ccb-512b-409e-8bf6-95fd0ea0d9eb",
		},
		{
			id: "1ab25ccb-512d-409e-8bf6-95fd0ea0d7be",
			roleId: "5bd43ccb-512d-409e-8bf6-95fd0ea0d9e8",
			permissionId: "4ad43ccb-512b-409e-8bf6-95fd0ea0d9ec",
		},
		{
			id: "1fe12ccb-512d-409e-8bf6-95fd0ea0d9b2",
			roleId: "5bd43ccb-512d-409e-8bf6-95fd0ea0d9e8",
			permissionId: "1bd43ccb-512b-409e-8bf6-95fd0ea0d3aa",
		},
		{
			id: "2fd43ccb-512d-409e-8bf6-95fd0ea0d9b2",
			roleId: "5bd43ccb-512d-409e-8bf6-95fd0ea0d9e8",
			permissionId: "4ad43ccb-512b-409e-8bf6-95fd0ea0d9ed",
		},
		{
			id: "3fd43ccb-512d-409e-8bf6-95fd0ea0d9b2",
			roleId: "5bd43ccb-512d-409e-8bf6-95fd0ea0d9e8",
			permissionId: "4ad43ccb-512b-409e-8bf6-95fd0ea0d9ee",
		},
		{
			id: "1ad43ccb-512d-409e-8bf6-95fd0ea0d9a1",
			roleId: "5bd43ccb-512d-409e-8bf6-95fd0ea0d9e8",
			permissionId: "4ad43ccb-512b-409e-8bf6-95fd0ea0d9ef",
		},
		{
			id: "2ad43ccb-512d-409e-8bf6-95fd0ea0d9a1",
			roleId: "5bd43ccb-512d-409e-8bf6-95fd0ea0d9e8",
			permissionId: "4ad43ccb-512b-409e-8bf6-95fd0ea0d9f0",
		},
		{
			id: "3ad43ccb-512d-409e-8bf6-95fd0ea0d9a1",
			roleId: "5bd43ccb-512d-409e-8bf6-95fd0ea0d9e8",
			permissionId: "4ad43ccb-512b-409e-8bf6-95fd0ea0d9f1",
		},
		{
			id: "4ad43ccb-512d-409e-8bf6-95fd0ea0d9a1",
			roleId: "5bd43ccb-512d-409e-8bf6-95fd0ea0d9e8",
			permissionId: "4ad43ccb-512b-409e-8bf6-95fd0ea0d9f2",
		},
		{
			id: "5ad43ccb-512d-409e-8bf6-95fd0ea0d9a1",
			roleId: "5bd43ccb-512d-409e-8bf6-95fd0ea0d9e8",
			permissionId: "4ad43ccb-512b-409e-8bf6-95fd0ea0d9f3",
		},
		{
			id: "6ad43ccb-512d-409e-8bf6-95fd0ea0d9a1",
			roleId: "5bd43ccb-512d-409e-8bf6-95fd0ea0d9e8",
			permissionId: "4ad43ccb-512b-409e-8bf6-95fd0ea0d9f4",
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
			role: "super_admin",
			supervisorId: "7ed43ccb-512d-409e-8bf6-95fd0ea0d9f4",
			region: "North",
			isDefaultPassword: false,
			status: "active",
			signature: null,
		},
	]);
}
