import logger from "@shared/utils/logger";
import { injectable } from "tsyringe";
import { CreateUser } from "../dtos/create-user.dto";
import UserFactory from "../factories/user.factory";
import { IUser } from "../model/user.model";
import UserRepo from "../repositories/user.repo";
import WalletRepo from "../repositories/wallet.repo";
import {
  generateCode,
  generateDummyAccountNumber,
} from "@shared/utils/functions.util";
import { ErrorResponse, SuccessResponse } from "@shared/utils/response.util";
import csvParser from "csv-parser";
import fs from "fs";
import IDVerificationService from "./id_verification.service";
import { templateMail } from "@shared/mailer/template";
import { userAccountMail } from "@shared/mailer/userAccountMail";
@injectable()
class UserService {
  constructor(
    private readonly userRepo: UserRepo,
    private readonly walletRepo: WalletRepo,
    private readonly idVerificationService: IDVerificationService
  ) {}

  async createUser(data: CreateUser, res) {
    // Check if a user with the provided email already exists
    const password = generateCode(5);
    data.password = password;

    const existingUser = await this.userRepo.findOne({ email: data.email });
    if (existingUser) {
      res.send(ErrorResponse("User already exists with this email"));
    }

    // check if supervisor exist
    const existingSupervisor = await this.userRepo.findOne({
      email: data.supervisorId,
    });
    if (!existingSupervisor) {
      res.send(ErrorResponse("Supervisor does not exists."));
    }

    // If the user doesn't exist, proceed with user creation
    const user = UserFactory.createUser(data);
    try {
      const createdUser = await this.userRepo.save(user);

      // call ID verification service
      const result = await this.idVerificationService.idVerification(
        {
          userId: createdUser.id,
          idNumber: data.idNumber,
          idType: data.idType,
        },
      );

      // Create a wallet for the user after successfully creating the user
      //const wallet = await this.createWalletForUser(createdUser);

      // send mail to user on account creaction success
      const mail = {
        subject: "User Account Creation",
        name: user.name,
        email: user.email.toLowerCase(),
        password: password,
        link: process.env.FRONTEND_BASEURL + "/login",
      };
      try {
        await userAccountMail(mail);
      } catch (error) {
        console.log(error);
      }

      const returnData = {
        user: createdUser,
      };
      return returnData;
    } catch (error: any) {
      // return this.handleUserCreationError(user, error);
      return res.status(500).json({ status: false, message: error.message });
    }
  }

  private async createWalletForUser(user: IUser) {
    const walletData = {
      userId: user.id,
      accountNumber: generateDummyAccountNumber(),
      balance: 0.0,
      ledgerBalance: 0.0,
      currency: "NGN",
    };

    return await this.walletRepo.save(walletData).catch((error) => {
      throw new Error(
        `Failed to create wallet for user ${user.id}: ${error.message}`
      );
    });
  }

  async getAll() {
    return await this.userRepo.getAll();
  }

  async getAllUsers(req: any) {
    const { page = 1, limit = 10, role, status, q } = req.query;

    // Define filters
    const filters: any = {};

    if (role) {
      filters.roleId = role;
    }

    if (status) {
      filters.status = status;
    }

    // Call the findWhere method for filtering and adding relations if needed
    const result = await this.userRepo.findWhere(filters);

    // Handle pagination
    const pageSize = parseInt(limit) || 10;
    const currentPage = parseInt(page) || 1;
    const totalRecords = result.length;
    const totalPages = Math.ceil(totalRecords / pageSize);

    const paginatedResult = result.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    );

    // Return paginated response
    return {
      users: paginatedResult,
      total_result: totalRecords,
      current_page: currentPage,
      total_pages: totalPages,
    };
  }

  async uploadBulkUser(req: any): Promise<{ added: any[], not_added: any[] }> {
    const file = req.file;
  
    const expectedHeaders = [
      "name",
      "email",
      "phone_number",
      "address",
      "id_type",
      "id_number",
      "role",
      "supervisor_email",
      "region",
    ];
  
    return new Promise((resolve, reject) => {
      if (!file) {
        return reject(new Error("No file uploaded"));
      }
  
      interface PayloadInterface {
        name: string;
        email: string;
        phone_number: string;
        address: string;
        id_type: string;
        id_number: string;
        role: string;
        supervisor_email: string;
        region: string;
      }
  
      const filePath = file.path;
      const results: PayloadInterface[] = [];
      const readStream = fs.createReadStream(filePath);
      const csvStream = csvParser();
  
      let headersValid = true;
      let headersChecked = false;
  
      readStream
        .pipe(csvStream)
        .on("headers", (headers: string[]) => {
          const missingHeaders = expectedHeaders.filter(
            (header) => !headers.includes(header)
          );
          if (missingHeaders.length > 0) {
            headersValid = false;
          }
          headersChecked = true;
        })
        .on("data", (data: PayloadInterface) => {
          if (headersChecked && headersValid) {
            results.push(data);
          }
        })
        .on("end", async () => {
          fs.unlinkSync(filePath); // Remove the uploaded file
  
          if (!headersValid) {
            return reject(new Error("Invalid CSV header. Ensure the CSV has the required columns."));
          }
  
          const added: any[] = [];
          const not_added: any[] = [];
  
          for (const element of results) {
            const existingUser = await this.userRepo.findOne({ email: element.email });
  
            if (existingUser) {
              not_added.push({
                email: element.email,
                reason: "Account with this email already exists",
              });
              continue; // Skip to the next iteration
            }
  
            const password = generateCode(5);
            const userData = {
              name: element.name,
              phoneNumber: element.phone_number,
              password: password,
              idNumber: element.id_number,
              idType: element.id_type,
              email: element.email,
              address: element.address,
              status: "active",
              hasChangedPassword: false,
              roleId: element.role,
              supervisorId: element.supervisor_email,
              region: element.region,
            };
  
            const user = UserFactory.createUser(userData);
  
            try {
              const createdUser = await this.userRepo.save(user);
  
              await this.idVerificationService.idVerification({
                userId: createdUser.id,
                idNumber: createdUser.idNumber,
                idType: createdUser.idType,
              });
  
              const mail = {
                subject: "User Account Creation",
                name: createdUser.name,
                email: createdUser.email,
                password: password,
                link: process.env.FRONTEND_BASEURL + "/login",
              };
  
              await userAccountMail(mail);
  
              added.push({
                email: createdUser.email,
                status: "User created successfully",
              });
            } catch (error: any) {
              console.log(error);
              not_added.push({
                email: element.email,
                reason: `Error: ${error.message}`,
              });
            }
          }
  
          resolve({ added, not_added }); // Resolve the promise with the result
        })
        .on("error", (err: any) => {
          console.error("Error while reading CSV file:", err);
          reject(new Error("Failed to process the CSV file."));
        });
    });
  }
  
  
  
}

export default UserService;
