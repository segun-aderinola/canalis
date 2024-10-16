import { DB_TABLES } from "@shared/enums/db-tables.enum";
// import { ObjectLiteral } from "@shared/types/object-literal.type";
import { Model, ModelObject } from "objection";
import bcrypt from "bcrypt";
// import { Role } from "./Role";  // Import Role model

const SALT_ROUNDS = 10;

export class User extends Model {
  static tableName = DB_TABLES.USERS;
  id!: string;
  name!: string;
  email!: string;
  password!: string;
  phoneNumber!: string;
  address?: string;
  idType!: string;
  idNumber!: string;
  region!: string;
  roleId!: string;           // For role-based access control
  supervisorId?: string;
  status!: string;
  hasChangedPassword!: boolean;
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

  async $beforeInsert(): Promise<void> {
    this.createdAt = new Date();
    this.updatedAt = new Date();
    if (this.password) {
      this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
    }
  }

  async $beforeUpdate(): Promise<void> {
    this.updatedAt = new Date();
    if (this.password) {
      this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
    }
  }

  static async validatePassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}

export type IUser = ModelObject<User>;
