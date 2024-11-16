import { injectable } from "tsyringe";
import { CreateUser } from "../dtos/create-user.dto";
import UserFactory from "../factories/user.factory";
import UserRepository from "../repositories/user.repository";
import { generateCode, isValidUUID } from "@shared/utils/functions.util";
import { ObjectLiteral } from "@shared/types/object-literal.type";
import MailService from "./mail.service";
import logger from "@shared/utils/logger";

@injectable()
class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly mailService: MailService
  ) {}

  async createUser(data: CreateUser) {
    try {
        const existingUserResponse = await this.checkIfUserExists(data.email);
        if (!existingUserResponse?.success) return existingUserResponse;

        const supervisorResponse = await this.checkSupervisorExistence(data.supervisorId);
        if (!supervisorResponse.success) return supervisorResponse;

        const password = this.generateUserPassword();
        data.password = password;

        const userCreationResponse = await this.createUserRecord(data);
        if (!userCreationResponse.success) return userCreationResponse;

        const emailResponse = await this.sendAccountCreationEmail(userCreationResponse.data!, password);
        if (!emailResponse.success) return emailResponse;

        return { success: true,message: "User account has been created successfully",data: userCreationResponse.data};
    } catch (error: any) {
        logger.error({ error: error.message }, "Error creating user");
        return {success: false,message: error.message || "An unexpected error occurred while creating the user"};
    }
}

  private generateUserPassword(): string {
    return generateCode(5);
}

  private async checkExistingUser(email: string) {
    return await this.userRepository.findOne({ email });
  }

  private async checkSupervisorExistence(supervisorId: string) {
    const supervisor = await this.validateSupervisor(supervisorId);
    if (!supervisor) {
        return { success: false, message: "Supervisor does not exist." };
    }
    return { success: true };
  }

  private async checkIfUserExists(email: string) {
    const existingUser = await this.checkExistingUser(email);
    if (existingUser) {
        return { success: false, message: "User already exists with this email" };
    }
    return { success: true };
}
  private async validateSupervisor(supervisorId: string) {
    const supervisorFilter: ObjectLiteral = {};

    if (isValidUUID(supervisorId)) {
      supervisorFilter.id = supervisorId;
    } else {
      throw new Error("Invalid supervisorId UUID format.");
    }

    return await this.userRepository.findOrWhere(supervisorFilter, undefined, { roleId: 'supervisor' })
  }

  private async createUserRecord(data: CreateUser) {
    try {
        const user = UserFactory.createUser(data);
        const createdUser = await this.userRepository.save(user);
        return { success: true, data: createdUser };
    } catch (error: any) {
        logger.error({ error: error.message }, "Error creating user record");
        return { success: false, message: "Failed to create user record" };
    }
}

private async sendAccountCreationEmail(user: any, password: string) {
  try {
      await this.sendAccountCreationMail(user, password);
      return { success: true };
  } catch (error: any) {
      logger.error({ error: error.message }, "Error sending email");
      return { success: false, message: "Failed to send account creation email." };
  }
}

  private async sendAccountCreationMail(user: any, password: string) {
    const mail = {
      subject: "User Account Creation",
      name: user.name,
      email: user.email.toLowerCase(),
      password: password,
      link: process.env.FRONTEND_BASEURL + "/login",
    };
    try {
      await this.mailService.sendUserAccountMail(mail);
    } catch (error: any) {
      logger.error({ error: error.message }, "Error sending account creation mail");
    }
  }

}

export default UserService;
