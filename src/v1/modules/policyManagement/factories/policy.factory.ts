import { CreatePolicy } from "../dtos/policy.dto";
import { Policy } from "../model/policy.model";

class PolicyFactory {
  static createPolicy(data: CreatePolicy): Policy {
    const policy = {} as Policy;
  
    policy.agentId = data.agentId;
    policy.supervisorId = data.supervisorId;
    policy.policyId = data.policyId;
    policy.cbaPolicyId = data.cbaPolicyId;
    policy.customerId = data.customerId;
    policy.productId = data.productId;
    policy.customerType = data.customerType;
    policy.businessType = data.businessType;
    policy.startDate = data.startDate;
    policy.endDate = data.endDate;
    policy.agentId = data.agentId;
    policy.brokerId = data.brokerId;
    policy.relationshipManagerId = data.relationshipManagerId;
    policy.sbu = data.sbu;
    policy.sbuId = data.sbuId;
    policy.branch = data.branch;
    policy.source = data.source;
    policy.sumInsured = data.sumInsured;
    policy.premium = data.premium;
    policy.ourSharePercentage = data.ourSharePercentage;
    policy.classOfBusinessId = data.classOfBusinessId;
    policy.currency = data.currency;
    policy.savingsGoal = data.savingsGoal;
    policy.paymentFrequency = data.paymentFrequency;
    policy.annualRiskCover = data.annualRiskCover;
    policy.annualRiskPremuim = data.annualRiskPremuim;
  
    return policy;
  }
  
}

export default PolicyFactory;
