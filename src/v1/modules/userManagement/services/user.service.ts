import logger from "@shared/utils/logger";
import { injectable } from "tsyringe";
import { CreateUser } from "../dtos/create-user.dto";
import UserFactory from "../factories/user.factory";
import { IUser } from "../model/user.model";
import UserRepo from "../repositories/user.repo";
import WalletRepo from "../repositories/wallet.repo";
import { generateDummyAccountNumber } from "../../../../utils/helper";

@injectable()
class UserService {
  constructor(private readonly userRepo: UserRepo, private readonly walletRepo: WalletRepo,) {}

  async createUser(data: CreateUser) {
    // Check if a user with the provided email already exists
    const existingUser = await this.userRepo.findOne({ email: data.email });
    //console.log(existingUser)
    if (existingUser) {
      // return {
      //   status: false, // Indicate an error with `false` status
      //   message: 'User already exists with this email',
      // };
      throw new Error('User already exists with this email');
    }
  
    // If the user doesn't exist, proceed with user creation
    const user = UserFactory.createUser(data);
    
    try {
      const createdUser = await this.userRepo.save(user);
      
      // Create a wallet for the user after successfully creating the user
      await this.createWalletForUser(createdUser);
  
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
