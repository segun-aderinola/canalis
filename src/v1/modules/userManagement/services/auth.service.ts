import { injectable } from "tsyringe";
import UserRepository from "../repositories/user.repository";
import { isAfter } from "date-fns";
import { generateCode, generateJwtToken } from "@shared/utils/functions.util";
import OtpRepository from "../repositories/otp.repository";
import OTPService from "./otp.service";
import { bcryptCompareHashedString } from "@shared/utils/hash.util";
import MailService from "./mail.service";
import logger from "@shared/utils/logger";

@injectable()
class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly OtpRepository: OtpRepository,
    private readonly otpService: OTPService,
    private readonly mailService: MailService,
  ) {}

  async forgetPassword(data: { email: string }) {
    try {
      const user = await this.userRepository.findOne({ email: data.email });
      if (!user) {
        return { success: false, message: "User not found" };
      }
      // generate a password reset link
      const token = generateCode(6);
      await this.otpService.sendOTP({user, token, otpType: "password-reset"})
      return {
        success: true,
        message: `Kindly check your email address ${user.email} for OTP`,
      };
    } catch (error: any) {
      logger.error({error: error.message}, "Error resetting password");
    }
  }

  async resetPassword(data: { email: string; password: string, token: string }) {
    try {
      const user = await this.userRepository.findOne({ email: data.email });
      if (!user) {
        return { success: false, message: "User not found" };
      }

      const checkOtp = await this.OtpRepository.findOne({
        userId: user.id,
        token: data.token,
        status: 'pending',
      });
      
      if (!checkOtp) {
        return {
          success: false,
          message: "Invalid OTP",
        };
      }
      
      const currentTime = new Date();
      const expirationTime = new Date(checkOtp.expiringDatetime);
      if (isAfter(currentTime, expirationTime)) {
        return {
          success: false,
          message: "OTP has expired",
        };
      }
  
      const id = checkOtp.id;
      
      try {
        await this.userRepository.updateById(checkOtp.userId, { isDefaultPassword: false, password: data.password });
        await this.OtpRepository.updateById(id, { status: 'used' });
      } catch (error: any) {
        logger.error({error: error.message}, "Error comfirming otp");
      }
    
      return {
        success: true,
        message: "Password has been reset successfully",
      };

    } catch (error: any) {
      logger.error({error: error.message}, "Error resetting otp");
    }
  }

  async changePasswordOnFirstLogin(data: { userId: string; password: string }) {
    try {
      const user = await this.userRepository.findOne({ id: data.userId });
      if (!user) {
        return { success: false, message: "User not found" };
      }

      if(user.isDefaultPassword == false){
        return { success: false, message: "Can`t perform this action!. Your password has been changed already."}
      }
      const id = user.id;
      
      await this.userRepository.updateById(id, { password: data.password, status: "active", isDefaultPassword: false });


      const message: string = "Your Password has been changed successfully. Kindly proceed to Login";
      const token = {
        token: await generateJwtToken(user)
      }
      return { success: true, message: message, data: token}
      
    } catch (error: any) {
      logger.error({error: error.message}, "Error changing password");
    }
  }

  async login(data: { email: string; password: string }) {
    try {
      const user = await this.userRepository.findByEmail(data.email);
      if (!user) {
        return { success: false, message: "User not found" };
      }

      if(user.isDefaultPassword == true){
        const data = {
          userId: user.id,
        };
        return { success: false, message: "Please change your password from the default password.", data}
      }
      
      if (user.status == "deactivated") {
        return { success: false, message: "Your account has been deactivated. Please contact administrator."}
      }

      const passwordMatch = await bcryptCompareHashedString(data.password, user?.password);
      
      if (!passwordMatch) {
        return { success: false, message: "Password is incorrect. Kindly check!"}
      }

      const token = await generateJwtToken(user);

      try {
        const mail = {
          email: user.email,
          subject: "Login Notification",
          name: user?.name,
        };
      
        await this.mailService.sendLoginEmail(mail)
      } catch (error: any) {}
      const returnResponse = {
        user,
        token: token,
      }
      return { success: true, message: "Login successful", data:returnResponse}

    } catch (error: any) {
      logger.error({error: error.message}, "Error logging in");
    }
  }
}


export default AuthService;
