export type CreatePolicyBeneficiary = {
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
  isDeleted: boolean;
};
