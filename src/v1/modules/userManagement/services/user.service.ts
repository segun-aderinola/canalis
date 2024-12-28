import { injectable } from "tsyringe";
import UserFactory from "../factories/user.factory";
import UserRepository from "../repositories/user.repository";
import {
  exportCSVData,
  generateCode,
  isValidUUID,
} from "@shared/utils/functions.util";
import { ObjectLiteral } from "@shared/types/object-literal.type";
import MailService from "./mail.service";
import logger from "@shared/utils/logger";
import { IUser } from "../model/user.model";
import { CreateUser } from "../dtos/create-user.dto";
import walletCreationQueue from "../queues/wallet-creation.queue";
import WalletService from "./wallet.service";
import WalletRepository from "../repositories/wallet.repository";

@injectable()
class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly mailService: MailService,
    private readonly walletService: WalletService,
    private readonly walletRepository: WalletRepository
  ) {}

  async createUser(data: CreateUser) {
    try {
      const existingUserResponse = await this.checkIfUserExists(data.email);
      if (!existingUserResponse?.success) return existingUserResponse;

      const supervisorResponse = await this.checkSupervisorExistence(
        data.supervisorId ?? ""
      );
      if (!supervisorResponse.success) return supervisorResponse;

      const password = this.generateUserPassword();
      data.password = password;

      const userCreationResponse = await this.createUserRecord(data);
      if (!userCreationResponse.success) return userCreationResponse;

      const emailResponse = await this.sendAccountCreationEmail(
        userCreationResponse.data!,
        password
      );
      if (!emailResponse.success) return emailResponse;

      return {
        success: true,
        message: "User account has been created successfully",
        data: userCreationResponse.data,
      };
    } catch (error: any) {
      logger.error({ error: error.message }, "Error creating user");
      return {
        success: false,
        message:
          error.message ||
          "An unexpected error occurred while creating the user",
      };
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

    return await this.userRepository.findOrWhere(supervisorFilter, undefined, {
      roleId: "supervisor",
    });
  }

  private async createUserRecord(data: CreateUser) {
    try {
      const user = UserFactory.createUser(data);
      const createdUser = await this.userRepository.save(user);
      await walletCreationQueue.add(
        { user: createdUser },
        { attempts: Number(process.env.QUEUE_ATTEMPTS) || 3, backoff: { type: "exponential", delay: Number(process.env.QUEUE_DELAY) || 5000 } },
      );
      return { success: true, data: createdUser };
    } catch (error: any) {
      logger.error({ error: error.message }, "Error creating user record");
      return { success: false, message: "Failed to create user record" };
    }
  }

  async uploadBulkUsers(req: any) {
    const users = req.body;
    const notAdded: any[] = [];
    const added: any[] = [];

    try {
      const existingUsersMap = await this.getExistingUsers(users);
      const supervisorsMap = await this.getSupervisors(users);

      const { userDataArray, mailDataArray } = this.processUsers(
        users,
        existingUsersMap,
        supervisorsMap,
        added,
        notAdded
      );

      const savedUsers = await this.saveUsers(userDataArray);
      const jobs = savedUsers.map((user) => ({
        data: { user },
        opts: {
          attempts: Number(process.env.QUEUE_ATTEMPTS) || 3,
          backoff: { type: "exponential", delay: Number(process.env.QUEUE_DELAY) || 5000 },
        },
      }));

      await walletCreationQueue.addBulk(jobs);
      await this.sendNotificationEmails(mailDataArray);

      return {
        success: true,
        message: "User upload successful",
        data: { added, notAdded },
      };
    } catch (error: any) {
      console.log(error);
      logger.error(
        { error: JSON.stringify(error) },
        "UserSerivce [BulkUserOnboarding]: Error Creating User"
      );
    }
  }

  private async sendAccountCreationEmail(user: any, password: string) {
    try {
      await this.sendAccountCreationMail(user, password);
      return { success: true };
    } catch (error: any) {
      logger.error({ error: error.message }, "Error sending email");
      return {
        success: false,
        message: "Failed to send account creation email.",
      };
    }
  }

  private async getExistingUsers(users: any[]): Promise<Map<string, any>> {
    const emails = users.map((user) => user.email);
    return await this.getExistingUsersMap(emails);
  }

  private async getSupervisors(users: any[]): Promise<Map<string, any>> {
    const supervisorIds = Array.from(
      new Set(users.map((user) => user.supervisorId))
    ).filter(isValidUUID);
    return await this.getSupervisorsMap(supervisorIds);
  }

  private processUsers(
    users: any[],
    existingUsersMap: Map<string, any>,
    supervisorsMap: Map<string, any>,
    added: any[],
    notAdded: any[]
  ) {
    const userDataArray: IUser[] = [];
    const mailDataArray: {
      subject: string;
      name: string;
      email: string;
      password: string;
      link: string;
    }[] = [];

    users.forEach((user) => {
      if (this.isExistingUser(user, existingUsersMap, notAdded)) return;
      if (!this.hasValidSupervisor(user, supervisorsMap, notAdded)) return;

      const password = generateCode(5);
      this.addUserAndMailData(
        user,
        password,
        userDataArray,
        mailDataArray,
        added,
        notAdded
      );
    });

    return { userDataArray, mailDataArray };
  }

  private isExistingUser(
    user: any,
    existingUsersMap: Map<string, any>,
    notAdded: any[]
  ): boolean {
    if (existingUsersMap.has(user.email)) {
      notAdded.push({
        email: user.email,
        reason: "Account with this email already exists",
      });
      return true;
    }
    return false;
  }

  private hasValidSupervisor(
    user: any,
    supervisorsMap: Map<string, any>,
    notAdded: any[]
  ): boolean {
    const supervisor = supervisorsMap.get(user.supervisorId);
    if (!supervisor) {
      notAdded.push({ email: user.email, reason: "Supervisor does not exist" });
      return false;
    }
    return true;
  }

  private addUserAndMailData(
    user: any,
    password: string,
    userDataArray: IUser[],
    mailDataArray: any[],
    added: any[],
    notAdded: any[]
  ) {
    try {
      const newUser = UserFactory.createUser(
        this.createUserData(user, password)
      );
      userDataArray.push(newUser);

      mailDataArray.push({
        subject: "User Account Creation",
        name: user.name,
        email: user.email,
        password: password,
        link: `${process.env.FRONTEND_BASEURL}/login`,
      });

      added.push({ email: user.email, status: "User created successfully" });
    } catch (error: any) {
      logger.error({ error: error.message }, "Error creating user");
      notAdded.push({ email: user.email, reason: `Error: ${error.message}` });
    }
  }

  private async saveUsers(userDataArray: IUser[]): Promise<IUser[]> {
    if (userDataArray.length) {
      return await this.userRepository.saveMany(userDataArray);
    }
    return [];
  }

  private async sendNotificationEmails(mailDataArray: any[]): Promise<void> {
    if (mailDataArray.length)
      await this.mailService.sendBulkUserAccountMail(mailDataArray);
  }

  private async getExistingUsersMap(
    emails: string[]
  ): Promise<Map<string, any>> {
    const existingUsers = await this.userRepository.findByEmails(emails);
    return new Map(existingUsers.map((user) => [user.email, user]));
  }

  private async getSupervisorsMap(
    supervisorIds: string[]
  ): Promise<Map<string, any>> {
    const supervisors = await this.userRepository.findByIdsAndRole(
      supervisorIds,
      "supervisor"
    );
    return new Map(
      supervisors.map((supervisor) => [supervisor.id, supervisor])
    );
  }

  private createUserData(user: any, password: string) {
    return {
      name: user.name,
      phoneNumber: user.phoneNumber,
      password: password,
      email: user.email,
      address: user.address,
      roleId: user.roleId,
      supervisorId: user.supervisorId,
      region: user.region,
    };
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
      logger.error(
        { error: error.message },
        "Error sending account creation mail"
      );
    }
  }

  async getAllUsers(req: any) {
    const { page = 1, limit = 10, role, status } = req.query;

    const filters: Record<string, any> = {};
    if (role) filters.roleId = role;
    if (status) filters.status = status;

    const pageSize = parseInt(limit, 10) || 10;
    const currentPage = parseInt(page, 10) || 1;

    try {
      const { data: users, totalRecords } =
        await this.userRepository.findAndCountAll(
          filters,
          [],
          currentPage,
          pageSize
        );

      if (users.length === 0) {
        return {
          users: [],
          total_result: 0,
          current_page: currentPage,
          total_pages: 0,
        };
      }

      const userIds = users.map((user) => user.id);

      const wallets =
        userIds.length > 0
          ? await this.walletRepository.findAllWhere({ userId: userIds })
          : [];

      const walletMap = new Map(
        wallets.map((wallet) => [wallet.userId, wallet])
      );

      const usersWithWalletDetails = users.map((user) => {
        const wallet = walletMap.get(user.id);
        return {
          ...user,
          wallet_details: wallet
            ? {
                accountNumber: wallet.accountNumber,
                walletId: wallet.walletId,
              }
            : null,
        };
      });

      const totalPages = Math.ceil(totalRecords / pageSize);

      return {
        users: usersWithWalletDetails,
        total_result: totalRecords,
        current_page: currentPage,
        total_pages: totalPages,
      };
    } catch (error) {
      console.error("Error fetching users:", error);
      throw new Error("An unexpected error occurred while fetching users.");
    }
  }

  async exportUser(req: any) {
    const { role, status, page = 1, limit = 10 } = req.query;

    const filters: any = {};
    if (role) filters.roleId = role;
    if (status) filters.status = status;

    const pageSize = parseInt(limit, 10) || 10;
    const currentPage = parseInt(page, 10) || 1;

    try {
      const { data: users } = await this.userRepository.findAndCountAll(
        filters,
        [],
        currentPage,
        pageSize
      );

      const userIds = users.map((user) => user.id);

      const wallets =
        userIds.length > 0
          ? await this.walletRepository.findAllWhere({ userId: userIds })
          : [];

      const walletMap = new Map(
        wallets.map((wallet) => [wallet.userId, wallet])
      );

      const all_users = users.map((user) => {
        const wallet = walletMap.get(user.id);
        return {
          name: user.name,
          email: user.email,
          phone_number: user.phoneNumber,
          role: user.roleId,
          status: user.status,
          account_number: wallet?.accountNumber || "N/A",
          wallet_id: wallet?.walletId || "N/A",
        };
      });

      const csvHeader = [
        { id: "name", title: "Name" },
        { id: "email", title: "Email" },
        { id: "phone_number", title: "Phone Number" },
        { id: "role", title: "Role" },
        { id: "account_number", title: "Account Number" },
        { id: "wallet_id", title: "Wallet ID" },
        { id: "status", title: "Status" },
      ];

      const csvContent = await exportCSVData(csvHeader, all_users);

      return {
        csvContent,
        fileName: "exported_users.csv",
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Error exporting users: ${error.message}`);
      } else {
        throw new Error("An unexpected error occurred while exporting users.");
      }
    }
  }

  async getProfile(req: any) {
    const user = await this.userRepository.findById(req.user.id);
    return {
      user: {
        name: user.name ?? "",
        phoneNumber: user.phoneNumber ?? "",
        avatar: user.avatar ?? "",
        email: user.email ?? "",
        address: user.address ?? "",
        roleId: user.roleId ?? "",
        supervisorId: user.supervisorId ?? "",
        region: user.region ?? "",
      },
      wallet: await this.walletService.getWallet(user.id),
    };
  }

  async deactivateUserAccount(req: any) {
    const id = req.params.id;

    const user = await this.userRepository.findById(id);
    if (!user) {
      return { success: false, message: "User not found" };
    }

    if (user.status === "inactive") {
      return { success: false, message: "User account is already deactivated" };
    }

    try {
      const updatedUser = await this.userRepository.updateById(id, {
        status: "inactive",
      });

      return {
        success: true,
        message: "User account deactivated successfully",
        data: updatedUser,
      };
    } catch (error) {
      logger.error({ error: error }, "Error deactivating user:");
      return { success: false, message: "Failed to deactivate user account" };
    }
  }

  async reactivateUserAccount(req: any) {
    const id = req.params.id;

    const user = await this.userRepository.findById(id);
    if (!user) {
      return { success: false, message: "User not found" };
    }

    if (user.status === "active") {
      return { success: false, message: "User account is already activated" };
    }

    const password = generateCode(5);

    const mail = {
      subject: "Account Reactivated",
      name: user.name,
      email: user.email.toLowerCase(),
      password: password,
      link: process.env.FRONTEND_BASEURL + "/login",
    };
    try {
      await this.mailService.sendAccountReactivationMail(mail);
    } catch (error: any) {
      logger.error({ error: error.message }, "Error sending mail");
    }

    try {
      const updatedUser = await this.userRepository.updateById(id, {
        status: "active",
        isDefaultPassword: true,
        password: password,
      });

      return {
        success: true,
        message: "User account activated successfully",
        data: updatedUser,
      };
    } catch (error: any) {
      logger.error({ error: error.message }, "Error deactivating user");
      return { success: false, message: "Failed to deactivate user account" };
    }
  }

  async updateUser(req) {
    try {
      const data = req.body;
      const user = await this.userRepository.findById(req.params.id);
      if (!user) {
        return { success: false, message: "User not found." };
      }

      const supervisorFilter: ObjectLiteral = {};

      if (data.supervisorId.includes("@")) {
        supervisorFilter.email = data.supervisorId;
      } else {
        if (!isValidUUID(data.supervisorId)) {
          return {
            success: false,
            message: "Invalid supervisorId UUID format",
          };
        }
        supervisorFilter.id = data.supervisorId;
      }
      const supervisor = await this.userRepository.findOrWhere(
        supervisorFilter,
        undefined,
        { roleId: "supervisor" }
      );
      if (!supervisor) {
        return { success: false, message: "Supervisor does not exists" };
      }
      await this.userRepository.updateById(req.params.id, {
        name: data.name,
        phoneNumber: data.phoneNumber,
        address: data.address,
        roleId: data.roleId,
        supervisorId: data.supervisorId,
      });
      return {
        success: true,
        message: "User data has been updated successfully",
      };
    } catch (error: any) {
      logger.error({ error: error.message }, "Failed to update user");
      return { status: false, message: error.message };
    }
  }
}

export default UserService;
