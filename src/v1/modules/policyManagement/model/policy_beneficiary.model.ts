import { DB_TABLES } from "@shared/enums/db-tables.enum";
import { Model, ModelObject } from "objection";

export class PolicyBeneficiary extends Model {
  static tableName = DB_TABLES.POLICY_BENEFICIARY;

  id: string;
  userId: string;
  policyId: string;
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  relationshipToCustomer: string;
  percentageRate: string;
  phoneNumber: string;
  alternatePhoneNumber?: string;
  emailAddress: string;
  meansOfId?: string;
  idNumber?: string;
  idExpiryDate: string;
  idURL?: string;
  status: string;
  isDeleted: boolean

  static relationMappings = {};
}

export type IPolicyBeneficiary = ModelObject<PolicyBeneficiary>;
