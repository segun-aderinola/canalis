import { Knex } from "knex";
import { DB_TABLES } from "../../shared/enums/db-tables.enum";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(DB_TABLES.OTP, (table: Knex.TableBuilder) => {
    table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
    table.string("userId").notNullable();
    table.string("token").notNullable().unique();
    table.date("expiringDate").notNullable();
    table.string("otpType").notNullable();
    table.integer("status").notNullable().defaultTo(0);

    table.timestamps(true, true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(DB_TABLES.OTP);
}
