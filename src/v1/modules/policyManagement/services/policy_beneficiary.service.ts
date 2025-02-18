import { Request } from "express";
import logger from "@shared/utils/logger";
import { injectable } from "tsyringe";
import ServiceUnavailableError from "@shared/error/service-unavailable.error";
import AppError from "@shared/error/app.error";
import PolicyBeneficiaryRepository from "../repositories/policy_beneficiary.repo";
import { IPolicyBeneficiary } from "../model/policy_beneficiary.model";
import PolicyBeneficiaryFactory from "../factories/policy_beneficiary.factory";
import PolicyRepository from "../repositories/policy.repo";
@injectable()
class PolicyBeneficiaryService {
  constructor(
    private readonly policyBeneficiaryRepository: PolicyBeneficiaryRepository,
    private readonly policyRepository: PolicyRepository,
  ) {}


  public async getPolicyBeneficiary(req: Request) {
    return await this.policyBeneficiaryRepository.findWhere({ policyId: req.params.id });
  }

  async createPolicyBeneficiary(req: Request) {
    try {
      const policy = await this.policyRepository.findById(
        req.params.id
      );
      if(!policy) throw new AppError(400, "Policy not found")
        if (req.body.percentageRate > 100) throw new AppError(400, `Total percentage of rate sharing exceeds 100%.`);
        req.body.userId = req.user.id
        req.body.policyId = req.params.id
        const policyBeneficiary: IPolicyBeneficiary = PolicyBeneficiaryFactory.createPolicyBeneficiary(req.body);
        return await this.policyBeneficiaryRepository
          .save(policyBeneficiary)
          .catch((error) => this.handlePolicyBeneficiaryError(policyBeneficiary, error));
    } catch (error: any) {
        throw new Error(error.message);
    }
  }

  async addPolicyBeneficiary(req: Request) {
    try {
      const policyId = req.params.id;
      const beneficiaries: IPolicyBeneficiary[] = req.body;
      const policy = await this.policyRepository.findById(policyId);
      if (!policy) throw new AppError(400, "Policy not found");

      const totalPercentage = beneficiaries.reduce((sum, b) => sum + parseFloat(b.percentageRate), 0);
      if (totalPercentage > 100) {
        throw new AppError(400, `Total percentage of rate sharing exceeds 100%. Currently: ${totalPercentage}%`);
      }
      if (totalPercentage < 100) {
        throw new AppError(400, `Total percentage of rate sharing is less than 100%. Currently: ${totalPercentage}%`);
      }

      const policyBeneficiaries: IPolicyBeneficiary[] = beneficiaries.map((beneficiary) =>
        PolicyBeneficiaryFactory.createPolicyBeneficiary({ ...beneficiary, policyId, userId: req.user.id })
      );

      return await this.policyBeneficiaryRepository
        .createBulk(policyBeneficiaries)
        .catch((error) =>
          this.handlePolicyMutlipleBeneficiaryError(policyBeneficiaries, error)
        );
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  private handlePolicyBeneficiaryError = (policyBeneficiary: IPolicyBeneficiary, error: any) => {
    logger.error(
      { error, policyBeneficiary },
      "PolicyService[handlePolicyBeneficiaryError]: Error occured creating Policy Beneficiary."
    );
    throw new ServiceUnavailableError(error);
  };

  private handlePolicyMutlipleBeneficiaryError = (policyBeneficiary: IPolicyBeneficiary[], error: any) => {
    logger.error(
      { error, policyBeneficiary },
      "PolicyService[handlePolicyBeneficiaryError]: Error occured creating Policy Beneficiary."
    );
    throw new ServiceUnavailableError();
  };

}

export default PolicyBeneficiaryService;
