import { Knex } from "knex";
import { DB_TABLES } from "../../shared/enums/db-tables.enum";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(DB_TABLES.WALLETS, (table: Knex.TableBuilder) => {
    table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
    table.string("userId").notNullable();
    table.string("accountNumber").notNullable();
    table.string("balance").defaultTo(0);
    table.string("ledgerBalance").defaultTo(0);
    table.string("currency").notNullable();

    table.timestamps(true, true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(DB_TABLES.WALLETS);
}
