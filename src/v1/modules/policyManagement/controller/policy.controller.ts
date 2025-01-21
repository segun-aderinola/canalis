import { Response, Request } from "express";
import { injectable } from "tsyringe";
import PolicyService from "../services/policy.service";
import httpStatus from "http-status";
import { ErrorResponse, SuccessResponse } from "@shared/utils/response.util";

@injectable()
class PolicyController {
  constructor(
    private readonly policyService: PolicyService
  ) {}

  createPolicy = async (req: any, res: Response) => {
    try {
      req.body.agentId = req.user.id;
      const policy = await this.policyService.createPolicy(req.body);
      return res
        .status(httpStatus.CREATED)
        .send(SuccessResponse("Operation successful", policy));
    } catch (error: any) {
      return res
        .status(500)
        .json(ErrorResponse(error.message));
    }
  };

  getAll = async (req: Request, res: Response) => {
    try {
      const policies = await this.policyService.getAll(req);
      res.send(SuccessResponse("Operation successful", policies));
    } catch (error: any) {
      res
        .status(500)
        .json(ErrorResponse(error.message));
    }
  };

  getPolicyByAgent = async (req: Request, res: Response) => {
    try {
      const policies = await this.policyService.getPolicyByAgentId(req);
      res.send(SuccessResponse("Operation successful", policies));
    } catch (error: any) {
      res
        .status(500)
        .json(ErrorResponse(error.message));
    }
  };

  getPolicyBySupervisor = async (req: Request, res: Response) => {
    try {
      const policies = await this.policyService.getPolicyBySupervisorId(req);
      res.send(SuccessResponse("Operation successful", policies));
    } catch (error: any) {
      res
        .status(500)
        .json(ErrorResponse(error.message));
    }
  };

  approvePolicy = async (req: Request, res) => {
    try {
      const policy = await this.policyService.approvePolicy(req);
      res.send(SuccessResponse("Policy approved successfully", policy));
    } catch (error: any) {
      res
        .status(500)
        .json(ErrorResponse(error.message));
    }
  };

  rejectPolicy = async (req: Request, res) => {
    try {
      await this.policyService.rejectPolicy(req);
      res.send(SuccessResponse("Policy rejected successfully"));
    } catch (error: any) {
      res
        .status(500)
        .json(ErrorResponse(error.message));
    }
  };

  getSinglePolicy = async (req: Request, res: Response) => {
    try {
      const policies = await this.policyService.getSinglePolicy(req);
      res.send(SuccessResponse("Operation successful", policies));
    } catch (error: any) {
      res
        .status(500)
        .json(ErrorResponse(error.message));
    }
  };

  creationCallback = async (req: Request, res: Response) => {
    try {
      await this.policyService.creationCallback(req);
      res.send(SuccessResponse("Operation successful"));
    } catch (error: any) {
      res
        .status(500)
        .json(ErrorResponse(error.message));
    }
  };
}

export default PolicyController;
