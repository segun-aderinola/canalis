import { injectable } from "tsyringe";
import userRepository from "../repositories/user.repository";
import {
  generateCode,
} from "@shared/utils/functions.util";
import MailService from "./mail.service";
import logger from "@shared/utils/logger";
@injectable()
class UserService {
  constructor(
    private readonly userRepository: userRepository,
    private readonly mailService: MailService

  ) {}

  async reactivateUserAccount(req: any) {
    const id = req.params.id;
  
    const user = await this.userRepository.findById(id);
    if (!user) {
      return { success: false, message: "User not found" };
    }
  
    if (user.status === 'active') {
      return { success: false, message: "User account is already activated" };
    }
  
    
    const password = generateCode(5)
  
    const mail = {
      subject: "Account Reactivated",
      name: user.name,
      email: user.email.toLowerCase(),
      password: password,
      link: process.env.FRONTEND_BASEURL + "/login",
    };
    try {
      await this.mailService.sendAccountReactivationMail(mail)
    } catch (error: any) {
      logger.error({error: error.message}, "Error sending mail");
    }
  
    try {
      
      const updatedUser = await this.userRepository.updateById(id, { status: 'active', isDefaultPassword: true, password: password });
  
      return { success: true, message: "User account activated successfully", data: updatedUser };
    } catch (error:any) {
      logger.error({error: error.message}, "Error deactivating user");
      return { success: false, message: "Failed to deactivate user account" };
    }
  }
}


export default UserService;
