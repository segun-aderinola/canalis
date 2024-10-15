import logger from "@shared/utils/logger";
import { injectable } from "tsyringe";
import { CreateUser } from "../dtos/create-user.dto";
import UserFactory from "../factories/user.factory";
import { IUser } from "../model/user.model";
import UserRepo from "../repositories/user.repo";
import WalletRepo from "../repositories/wallet.repo";
import {generateCode, generateDummyAccountNumber} from "@shared/utils/functions.util";
import { ErrorResponse } from "@shared/utils/response.util";
import userAccountMail from "@shared/mailer/userAccountMail";
import csvParser from "csv-parser";
import fs from "fs";
@injectable()
class UserService {
  constructor(private readonly userRepo: UserRepo, private readonly walletRepo: WalletRepo,) {}

  async createUser(data: CreateUser, res) {
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

  async uploadBulkUser(data: CreateUser, res, req) {
    const expectedHeaders = [
      "name",
      "email",
      "phone_number",
      "address",
      "means_of_id",
      "role",
      "supervisorId",
      "regionId",
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
        means_of_id: string;
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
            return res
              .status(400)
              .json(
                sendError(
                  "Invalid CSV header. Ensure the CSV has the required columns."
                )
              );
          }

          try {
            const added: any[] = [];
            const not_added: any[] = [];

            for (const element of results) {
              const emailNumberExist = await models.User.findOne({
                where: { email: element.email },
              });

              if (emailNumberExist) {
                not_added.push({
                  email: element.email,
                  reason: "User already exists",
                });
                // send email to admin
                continue; // Skip existing users
              }

              const password = generateCode(5);
              const userCreate = await models.User.create(
                {
                  name: element.name,
                  email: element.email,
                  role: element.role,
                  phoneNumber: element.phone_number,
                  password: password,
                  address: element.address,
                  meansOfId: element.means_of_id,
                  supervisor: element.supervisor,
                  region: element.region,
                },
                { transaction }
              );

              await models.Wallet.create({
                userId: userCreate.id,
              });

              added.push({ email: element.email });

              // Send user account creation email
              const mail = {
                subject: "User Account Creation",
                credentials: {
                  name: element.name,
                  email: element.email.toLowerCase(),
                  password: password,
                  link: process.env.FRONTEND_BASEURL + "/login",
                },
              };

              try {
                await userAccountMail.send(mail);
              } catch (mailError) {
                console.error("Failed to send email", mailError);
              }
            }

            // Commit transaction
            await transaction.commit();
            const data = {
              not_added,
              added,
            };
            return res
              .status(200)
              .json(sendSuccess("Bulk upload completed", data));
          } catch (error: any) {
            // Rollback in case of error
            await transaction.rollback();
            return res.status(500).json({ error: error.message });
          }
        })
        .on("error", (err: any) => {
          console.error("Error while reading CSV file:", err);
          return res
            .status(500)
            .json({ error: "Failed to process the CSV file." });
        });
    } catch (error: any) {
      await transaction.rollback();
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
      balance: 0,
      currency: "NGN",
    };
  
    await this.walletRepo.save(walletData).catch((error) => {
      throw new Error(`Failed to create wallet for user ${user.id}: ${error.message}`);
    });
  }
  
  async getAll() {
    return await this.userRepo.getAll();
  }

}

export default UserService;
