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

      try {
        await userAccountMail.send(mail);
      } catch (error) {}

      return createdUser;
    } catch (error) {
      return this.handleUserCreationError(user, error);
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

  private handleUserCreationError = (user: IUser, error: any) => {
    logger.error(
      { error, user },
      "UserService[handleUserCreationError]: Error occured creating users."
    );
  };
}

export default UserService;
