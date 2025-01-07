import { DB_TABLES } from "@shared/enums/db-tables.enum";
import { Model, ModelObject } from "objection";

export class Policy extends Model {
  static tableName = DB_TABLES.POLICIES;

  id: string;
  supervisorId: string;
  policyId: string;
  cbaPolicyId: string;
  customerId: string;
  productId: string;
  customerType: string;
  businessType: string;
  startDate: string;
  endDate: string;
  agentId: string;
  brokerId?: string;
  relationshipManagerId?: string;
  sbu?: string;
  sbuId: string;
  branch?: string;
  source: string;
  sumInsured: number;
  premium: number;
  ourSharePercentage: number;
  classOfBusinessId: string;
  currency: string;
  status: string;
  cbaStatus: string;
  savingsGoal?: string;
  paymentFrequency:string;
  annualRiskCover: string;
  annualRiskPremuim?: string


  static relationMappings = {};
}

export type IPolicy = ModelObject<Policy>;
