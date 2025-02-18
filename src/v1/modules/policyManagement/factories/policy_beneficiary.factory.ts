import { CreatePolicyBeneficiary } from "../dtos/policy_beneficiary.dto";
import { PolicyBeneficiary } from "../model/policy_beneficiary.model";

class PolicyBeneficiaryFactory {
  static createPolicyBeneficiary(data: CreatePolicyBeneficiary): PolicyBeneficiary {
    const policyBeneficiary = {} as PolicyBeneficiary;

    policyBeneficiary.userId = data.userId;
    policyBeneficiary.policyId = data.policyId;
    policyBeneficiary.firstName = data.firstName;
    policyBeneficiary.lastName = data.lastName;
    policyBeneficiary.gender = data.gender;
    policyBeneficiary.dateOfBirth = data.dateOfBirth;
    policyBeneficiary.relationshipToCustomer = data.relationshipToCustomer;
    policyBeneficiary.percentageRate = data.percentageRate;
    policyBeneficiary.phoneNumber = data.phoneNumber;
    policyBeneficiary.alternatePhoneNumber = data.alternatePhoneNumber;
    policyBeneficiary.emailAddress = data.emailAddress;
    policyBeneficiary.meansOfId = data.meansOfId;
    policyBeneficiary.idNumber = data.idNumber;
    policyBeneficiary.idExpiryDate = data.idExpiryDate;
    policyBeneficiary.idURL = data.idURL;

    return policyBeneficiary;
  }
}

export default PolicyBeneficiaryFactory;
