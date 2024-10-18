import { injectable } from "tsyringe";
import UserRepo from "../repositories/user.repo";
import { addMinutes, isAfter } from "date-fns";
import { generateCode, generateJwtToken } from "@shared/utils/functions.util";
import OTPRepo from "../repositories/otp.repo";
import { resetPasswordMail } from "@shared/mailer/resetPasswordMail";
import OTPService from "./otp.service";
import { bcryptCompareHashedString } from "@shared/utils/hash.util";
import { loginMail } from "@shared/mailer/loginMail";

@injectable()
class AuthService {
  constructor(
    private readonly userRepo: UserRepo,
    private readonly otpRepo: OTPRepo,
    private readonly otpService: OTPService,
  ) {}

  async forgetPassword(data: { email: string }) {
    try {
      const user = await this.userRepo.findOne({ email: data.email });
      if (!user) {
        return { success: false, message: "User not found" };
      }
      // generate a password reset link
      const token = generateCode(4);
      
      await this.otpService.sendOTP({user, token, otpType: "password-reset"})

      // const OTP_VALIDITY_DURATION = 10; // OTP valid for 10 minutes
      // const expiryDate = addMinutes(new Date(), OTP_VALIDITY_DURATION);
      // const localExpiryDate = expiryDate.toLocaleString('en-US', { timeZone: 'Africa/Lagos' });

      // const checkUnUsedOTP = await this.otpRepo.findOne({
      //   userId: user.id,
      //   status: 0,
      // });
      // if (checkUnUsedOTP) {
      //   const id = checkUnUsedOTP.id;
      //   await this.otpRepo.updateById(id, {
      //     token: token,
      //     expiringDatetime: expiryDate,
      //   });
      // } else {
      //   await this.otpRepo.save({
      //     userId: user?.id,
      //     token: token,
      //     status: 0,
      //     expiringDatetime: expiryDate,
      //     otpType: "password-reset",
      //   });
      // }

      // //send to the link via email
      // try {
      //   await resetPasswordMail(mail);
      // } catch (e) {
      //   console.log(e);
      // }
      return {
        success: true,
        message: `Kindly check your email address ${user.email} for OTP`,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async confirmOtp(data: { email: string; token: string }) {
    try {
      const user = await this.userRepo.findOne({ email: data.email });
      if (!user) {
        return { success: false, message: "User not found" };
      }

      const checkOtp = await this.otpRepo.findOne({
        userId: user.id,
        status: 0,
      });
      if (!checkOtp) {
        return {
          success: false,
          message: "Invalid OTP",
        };
      }
      if (checkOtp.status == 1) {
        return { success: false, message: "Otp has been used" };
      }
      const currentTime = new Date();
      const expirationTime = new Date(checkOtp.expiringDatetime);
      console.log(currentTime, expirationTime)
      if (isAfter(currentTime, expirationTime)) {
        return {
          success: false,
          message: "OTP has expired",
        };
      }
      const id = checkOtp.id;
      await this.otpRepo.updateById(id, { status: 1 });
      return {
        success: true,
        message: "OTP is valid",
      };
    } catch (error) {
      console.log(error);
    }
  }

  async resetPassword(data: { email: string; password: string }) {
    try {
      const user = await this.userRepo.findOne({ email: data.email });
      if (!user) {
        return { success: false, message: "User not found" };
      }

      const checkOtp = await this.otpRepo.findOne({
        userId: user.id,
        status: 1,
      });
      if (!checkOtp) {
        return {
          success: false,
          message: "Kindly request for an OTP to carry out this operation",
        };
      }
  
      const id = checkOtp.id;
      await this.userRepo.updateById(id, { password: data.password });
      await this.otpRepo.updateById(id, { status: 2 });
      return {
        success: true,
        message: "Password has been reset successfully",
      };

    } catch (error) {
      console.log(error);
    }
  }

  async changePasswordOnFirstLogin(data: { userId: string; password: string }) {
    try {
      const user = await this.userRepo.findOne({ id: data.userId });
      if (!user) {
        return { success: false, message: "User not found" };
      }

      if(user.hasChangedPassword == true){
        return { success: false, message: "Can`t perform this action!. Your password has been changed already."}
      }
      const id = user.id;
      
      await this.userRepo.updateById(id, { password: data.password, hasChangedPassword: true });


      const message: string = "Your Password has been changed successfully. Kindly proceed to Login";
      const token = {
        token: await generateJwtToken(user)
      }
      return { success: true, message: message, data: token}
      
    } catch (error) {
      console.log(error);
    }
  }

  async login(data: { email: string; password: string }) {
    try {
      const user = await this.userRepo.findByEmail(data.email);
      if (!user) {
        return { success: false, message: "User not found" };
      }

      if(user.hasChangedPassword == "false"){
        const data = {
          reason: "CHANGE_PASSWORD",
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
        await loginMail(mail);
      } catch (error: any) {}
      const returnResponse = {
        user,
        token: token,
      }
      return { success: true, message: "Login successful", data:returnResponse}

    } catch (error) {
      console.log(error);
    }
  }
}


export default AuthService;
