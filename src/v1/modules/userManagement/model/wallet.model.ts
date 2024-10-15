import { DB_TABLES } from "@shared/enums/db-tables.enum";
// import { ObjectLiteral } from "@shared/types/object-literal.type";
import { Model, ModelObject } from "objection";


export class Wallet extends Model {
  static tableName = DB_TABLES.WALLETS;
  id!: string;
  userId!: string;
  accountNumber!: string;
  balance!: number;
  ledgerBalance!: number;
  createdAt!: Date;
  updatedAt!: Date;

  
  // static relationMappings = {
  //   role: {
  //     relation: Model.BelongsToOneRelation,
  //     modelClass: Role,
  //     join: {
  //       from: 'users.roleId',
  //       to: 'roles.id',
  //     },
  //   },
  // };


}

// Define the audit trail type
export type IWallet = ModelObject<Wallet>;
