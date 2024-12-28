import { injectable } from "tsyringe";
import { addMinutes } from "date-fns";
import OtpRepository from "../repositories/otp.repository";
import { IUser } from "../model/user.model";
import MailService from "./mail.service";
import logger from "@shared/utils/logger";


@injectable()
class OTPService {
  constructor(private readonly otpRepository: OtpRepository, private readonly mailService: MailService) {}

  async sendOTP(data: { user: IUser, token: string, otpType: string }) {
    const OTP_VALIDITY_DURATION = 10; 
      const expiryDate = addMinutes(new Date(), OTP_VALIDITY_DURATION);
    
      const checkUnUsedOTP = await this.otpRepository.findOne({
        userId: data.user.id,
        status: 'pending',
      });
      if (checkUnUsedOTP) {
        const id = checkUnUsedOTP.id;
        await this.otpRepository.updateById(id, {
          status: 'expired'
        });
      }
        await this.otpRepository.save({
          userId: data.user.id,
          token: data.token,
          expiringDatetime: expiryDate,
          otpType: data.otpType,
        });
      
      const mail = {
        name: data.user?.name,
        email: data.user.email,
        subject: "Password Reset Notification",
        otp: data.token,
      };
      try {
        await this.mailService.sendOTPMail(mail)
      } catch (error: any) {
        logger.error({error: error.message}, "Error sending OTP");
      }
  }
}

export default OTPService;
