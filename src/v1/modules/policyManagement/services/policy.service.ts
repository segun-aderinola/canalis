import { Request } from "express";
import logger from "@shared/utils/logger";
import { injectable } from "tsyringe";
import { CreatePolicy } from "../dtos/policy.dto";
import PolicyFactory from "../factories/policy.factory";
import PolicyRepository from "../repositories/policy.repo";
import { IPolicy } from "../model/policy.model";
import NotFoundError from "@shared/error/not-found.error";
import UserRepository from "../../userManagement/repositories/user.repository";
import { IUser } from "../../userManagement/model/user.model";
import { createPolicy } from "@shared/external-services/policies/policy.service";
import MailService from "../../userManagement/services/mail.service";
import NotificationService from "./notification.service";
import UserService from "../../userManagement/services/user.service";
import ServiceUnavailableError from "@shared/error/service-unavailable.error";
@injectable()
class PolicyService {
  constructor(
    private readonly policyRepository: PolicyRepository,
    private readonly userRepository: UserRepository,
    private readonly mailService: MailService,
    private readonly notificationService: NotificationService,
    private readonly userService: UserService
  ) {}

  async createPolicy(data: CreatePolicy): Promise<any> {
    try {
      await this.userService.checkSupervisorExistence(data.supervisorId);
      const policy = PolicyFactory.createPolicy(data);
      return await this.policyRepository
        .save(policy)
        .catch((error) => this.handlePolicyError(policy, error))
        .then(async () => {
          await this.sendPolicyCreationMail(policy);
        });
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  public async getAll(_req: Request) {
    return await this.policyRepository.getAll();
  }

  public async getPolicyByAgentId(req: Request) {
    const agentExist: IUser = await this.userRepository.findById(req.params.id);
    if (!agentExist) {
      throw new NotFoundError();
    }

    return await this.policyRepository.findWhere({ agentId: req.params.id });
  }

  public async getPolicyBySupervisorId(req: Request) {
    const supervisorExist: IUser = await this.userRepository.findById(
      req.params.id
    );
    if (!supervisorExist) {
      throw new NotFoundError();
    }
    return await this.policyRepository.findWhere({
      supervisorId: req.params.id,
    });
  }

  public async getSinglePolicy(req: Request) {
    const policy: IPolicy = await this.policyRepository.findById(req.params.id);
    if (!policy) {
      throw new NotFoundError();
    }
    return policy;
  }

  async approvePolicy(req: Request) {
    try {
      const policy: IPolicy = await this.policyRepository.findById(
        req.params.id
      );
      if(!policy) {
        throw new NotFoundError();
      }

      const policyCreation = await createPolicy(policy);
      await this.policyRepository.updateById(req.params.id, {
        status: "approved",
        cbaStatus: policyCreation.status,
        policyId: policyCreation.id
      });

      await this.notificationService.createNotification({
        userId: policy.supervisorId,
        policyId: policy.policyId,
        data: JSON.stringify(policy)
      })
      await this.sendPolicyCreationMail(policy);

      return policyCreation;
    } catch (error: any) {
        throw new Error(error.message);
    }
  }

  async creationCallback(req: Request) {
    try {
      const policy: IPolicy = await this.policyRepository.findById(
        req.body.policyId
      );
      await this.policyRepository.updateById(req.body.policyId, {
        status: req.body.status,
        cbaStatus: req.body.status,
      });

      await this.notificationService.createNotification({
        userId: policy.supervisorId,
        policyId: policy.policyId,
        data: JSON.stringify(policy)
      })
    } catch (error: any) {
        throw new Error(error.message);
    }
  }

  async rejectPolicy(req: Request) {
    const policy: IPolicy = await this.policyRepository.findById(req.params.id);
    if(!policy) {
      throw new NotFoundError();
    }
    await this.policyRepository.updateById(req.params.id, {
      status: "rejected",
    });
    await this.notificationService.createNotification({
      userId: policy.supervisorId,
      policyId: policy.policyId,
      data: JSON.stringify(policy),
    });
    await this.sendPolicyRejectionMail(policy);

    return true;
  }

  private handlePolicyError = (policy: IPolicy, error: any) => {
    logger.error(
      { error, policy },
      "PolicyService[handlePolicyError]: Error occured creating Policy."
    );
    throw new ServiceUnavailableError();
  };

  async sendPolicyCreationMail(policy: IPolicy) {
    const user = await this.userRepository.findById(policy.supervisorId);
    const data = {
      subject: "Policy Creation",
      name: user.firstName,
      email: user.email,
    };
    try {
      await this.mailService.policyCreationMail(data);
    } catch (error) {
      logger.error(
        { error, policy },
        "PolicyService[handlePolicyError]: Error occured sending email."
      );
    }
  }

  async sendPolicyRejectionMail(policy: IPolicy) {
    const user = await this.userRepository.findById(policy.agentId);
    if(!user) {
      throw new NotFoundError(`Agent with this ID ${policy.agentId} not found`);
    }
    const data = {
      subject: "Policy Rejected",
      name: user.firstName,
      email: user.email,
    };
    try {
      await this.mailService.policyRejectionMail(data);
    } catch (error) {
      logger.error(
        { error, policy },
        "PolicyService[handlePolicyError]: Error occured sending email."
      );
    }
  }
}

export default PolicyService;
