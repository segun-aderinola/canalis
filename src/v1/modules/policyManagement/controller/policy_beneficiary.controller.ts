import { Response, Request } from "express";
import { injectable } from "tsyringe";
import httpStatus from "http-status";
import { ErrorResponse, SuccessResponse } from "@shared/utils/response.util";
import PolicyBeneficiaryService from "../services/policy_beneficiary.service";

@injectable()
class PolicyBeneficiaryController {
  constructor(
    private readonly policyBeneficiaryService: PolicyBeneficiaryService
  ) {}

  createPolicyBeneficiary = async (req: Request, res: Response) => {
    try {
      const policyBeneficiary = await this.policyBeneficiaryService.createPolicyBeneficiary(req);
      return res
        .status(httpStatus.CREATED)
        .send(SuccessResponse("Operation successful", policyBeneficiary));
    } catch (error: any) {
      return res
        .status(500)
        .json(ErrorResponse(error.message));
    }
  };

  createMultiplePolicyBeneficiary = async (req: Request, res: Response) => {
    try {
      const policyBeneficiary = await this.policyBeneficiaryService.createMultiplePolicyBeneficiary(req);
      return res
        .status(httpStatus.CREATED)
        .send(SuccessResponse("Operation successful", policyBeneficiary));
    } catch (error: any) {
      return res
        .status(500)
        .json(ErrorResponse(error.message));
    }
  };

  getBeneficiaryDetails = async (req: Request, res: Response) => {
    try {
      const policies = await this.policyBeneficiaryService.getPolicyBeneficiary(req);
      res.send(SuccessResponse("Operation successful", policies));
    } catch (error: any) {
      res
        .status(500)
        .json(ErrorResponse(error.message));
    }
  };

}

export default PolicyBeneficiaryController;
