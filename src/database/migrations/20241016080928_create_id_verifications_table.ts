import { Knex } from "knex";
import { DB_TABLES } from "../../shared/enums/db-tables.enum";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(DB_TABLES.IDVERIFICATION, (table: Knex.TableBuilder) => {
    table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
    table.string("userId").notNullable();
    table.string("idType").notNullable();
    table.string("idNumber").notNullable();
    table.string("issuingDate").notNullable();
    table.string("expiringDate").notNullable();

    table.timestamps(true, true, true);

    table.index("userId");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(DB_TABLES.IDVERIFICATION);
}
