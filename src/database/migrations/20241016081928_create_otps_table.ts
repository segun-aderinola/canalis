import { Knex } from "knex";
import { DB_TABLES } from "../../shared/enums/db-tables.enum";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(DB_TABLES.OTP, (table: Knex.TableBuilder) => {
    table.uuid("id").primary().defaultTo(knex.fn.uuid());
    table.uuid("userId").notNullable();
    table.string("token").notNullable();
    table.timestamp("expiringDatetime").notNullable();
    table.string("otpType").notNullable();
    table.string("status").notNullable().defaultTo('pending').comment("pending = new OTP, success = used OTP, expired = expired OTPs");

		// Ensure the userId column is a UUID to match the referenced column in the users table
		table
			.uuid("userId")
			.references("id")
			.inTable(DB_TABLES.USERS)
			.onDelete("CASCADE")
			.onUpdate("CASCADE");

		table.timestamps(true, true, true);

		// Add an index on the userId column
		table.index("userId");
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable(DB_TABLES.OTP);
}
