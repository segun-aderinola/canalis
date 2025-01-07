import { DB_TABLES } from "@shared/enums/db-tables.enum";
import { Model, ModelObject } from "objection";

export class Notification extends Model {
  static tableName = DB_TABLES.NOTIFICATIONS;

  id: string;
  userId: string;
  policyId: string;
  data: string;
  

  static relationMappings = {};
}

export type INotification = ModelObject<Notification>;
