import logger from "@shared/utils/logger";
import { injectable } from "tsyringe";
import { CreateUser } from "../dtos/create-user.dto";
import UserFactory from "../factories/user.factory";
import { IUser } from "../model/user.model";
import UserRepo from "../repositories/user.repo";
import WalletRepo from "../repositories/wallet.repo";
import {generateCode, generateDummyAccountNumber} from "@shared/utils/functions.util";
import { ErrorResponse, SuccessResponse } from "@shared/utils/response.util";
import userAccountMail from "@shared/mailer/userAccountMail";
import csvParser from "csv-parser";
import fs from "fs";
import IDVerificationService from "./id_verification.service";
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
      res.send(ErrorResponse("User already exists with this email"))
    }
    
    // check if supervisor exist 
    const existingSupervisor = await this.userRepo.findOne({ email: data.supervisorId });
    if (!existingSupervisor) {
      res.send(ErrorResponse("Supervisor does not exists."))
    }

    // If the user doesn't exist, proceed with user creation
    const user = UserFactory.createUser(data);
    try {
      const createdUser = await this.userRepo.save(user);

      // call ID verification service
      const result = await this.idVerificationService.idVerification({ userId: createdUser.id, idNumber: data.idNumber, idType: data.idType }, res)

      // Create a wallet for the user after successfully creating the user
      //const wallet = await this.createWalletForUser(createdUser);

      // send mail to user on account creaction success
      const mail = {
        subject: "User Account Creation",
        credentials: {
          name: user.name,
          email: user.email.toLowerCase(),
          password: password,
          link: process.env.FRONTEND_BASEURL + "/login",
        },
      };
      //console.log(mail)
      try {
        await userAccountMail.send(mail);
      } catch (error) {
        console.log(error)
      }

      const returnData = {
        user: createdUser
      }
      return returnData;
    } catch (error: any) {
      // return this.handleUserCreationError(user, error);
      return res.status(500).json({ status: false, message: error.message })
    }
  }

  async uploadBulkUser(res, req) {
    const expectedHeaders = [
      "name",
      "email",
      "phone_number",
      "address",
      "id_type",
      "id_number",
      "role",
      "supervisor",
      "region",
    ];
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      interface PayloadInterface {
        name: string;
        email: string;
        phone_number: string;
        address: string;
        id_type: string;
        id_number: string;
        role: string;
        supervisor: string;
        region: string;
      }

      const filePath = req.file.path;

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
          // Push data only if headers have been validated
          if (headersChecked && headersValid) {
            results.push(data);
          }
        })
        .on("end", async () => {
          // Remove the uploaded file
          fs.unlinkSync(filePath);

          if (!headersValid) {
            return res.send("Invalid CSV header. Ensure the CSV has the required columns.");
          }


            const added: any[] = [];
            const not_added: any[] = [];

            for (const element of results) {
             
              const existingUser = await this.userRepo.findOne({ email: element.email });

              if (existingUser) {
                not_added.push({
                  email: element.email,
                  reason: "User already exists",
                });
                // send email to admin
                continue; // Skip existing users
              }
              added.push({ email: element.email });

              const password = generateCode(5);
              const data = {
                name: element.name,
                phoneNumber: element.phone_number,
                password: password,
                idType: element.id_type,
                idNumber: element.id_number,
                email: element.email,
                address: element.address,
                status: "active",
                hasChangedPassword: false,
                roleId: element.role,
                supervisorId: element.supervisor,
                region: element.region
              }
              
  
              const user = UserFactory.createUser(data);
          try {
            const createdUser = await this.userRepo.save(user);
            // Create a wallet for the user after successfully creating the user
            const wallet = await this.createWalletForUser(createdUser);
            

            // send mail to user on account creaction success
            const mail = {
              subject: "User Account Creation",
              credentials: {
                name: createdUser.name,
                email: createdUser.email.toLowerCase(),
                password: password,
                link: process.env.FRONTEND_BASEURL + "/login",
              },
            };
            
            try {
              await userAccountMail.send(mail);
            } catch (error) {
              console.log(error)
            }
            

            const data = {
              not_added,
              added,
            };
            res.send(SuccessResponse("Bulk upload completed", data));
          } catch (error: any) {
            return res.status(500).json({ status: false, message: error.message });
          }
        }
        })
        .on("error", (err: any) => {
            console.error("Error while reading CSV file:", err);
            return res.status(500).json({ status: false, message: "Failed to process the CSV file." });

        });
    } catch (error: any) {
      console.error("Transaction failed:", error);
      return res.status(500).json({ error: error.message });
    }
  }

  async updateUser(data: CreateUser, res) {
    // Check if a user with the provided email already exists
    const password = generateCode(5);
    data.password = password;
    const existingUser = await this.userRepo.findOne({ email: data.email });
    if (existingUser) {
      res.send(ErrorResponse("User already exists with this email"))
    }
    // If the user doesn't exist, proceed with user creation
    const user = UserFactory.createUser(data);
    try {
      const createdUser = await this.userRepo.save(user);
      // Create a wallet for the user after successfully creating the user
      await this.createWalletForUser(createdUser);
      

      // send mail to user on account creaction success
      const mail = {
        subject: "User Account Creation",
        credentials: {
          name: user.name,
          email: user.email.toLowerCase(),
          password: password,
          link: process.env.FRONTEND_BASEURL + "/login",
        },
      };
      //console.log(mail)
      try {
        await userAccountMail.send(mail);
      } catch (error) {
        console.log(error)
      }

      return createdUser;
    } catch (error: any) {
      // return this.handleUserCreationError(user, error);
      return res.status(500).json({ status: false, message: error.message })
    }
  }
  
  
  private async createWalletForUser(user: IUser) {  
    const walletData = {
      userId: user.id,
      accountNumber: generateDummyAccountNumber(),
      balance: 0.00,
      ledgerBalance: 0.00,
      currency: "NGN",
    };
  
    return await this.walletRepo.save(walletData).catch((error) => {
      throw new Error(`Failed to create wallet for user ${user.id}: ${error.message}`);
    });
  }
  
  
  async getAll() {
    return await this.userRepo.getAll();
  }

}

export default UserService;
