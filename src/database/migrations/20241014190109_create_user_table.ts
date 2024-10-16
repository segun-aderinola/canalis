import { Knex } from "knex";
import { DB_TABLES } from "../../shared/enums/db-tables.enum";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(DB_TABLES.USERS, (table: Knex.TableBuilder) => {
    table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
    table.string("name").notNullable();
    table.string("email").notNullable().unique();
    table.string("phoneNumber").notNullable();
    table.string("password").notNullable();
    table.string("idType").notNullable();
    table.string("idNumber").notNullable();
    table.string("address").notNullable();
    table.string("roleId").notNullable();
    table.string("supervisorId").notNullable();
    table.string("region").notNullable();
    table.string("hasChangedPassword").notNullable().defaultTo(false);
    table.string("status").notNullable().defaultTo('active');

    table.timestamps(true, true, true);

    table.index("id");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(DB_TABLES.USERS);
}
