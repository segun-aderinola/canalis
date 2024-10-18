import { injectable } from "tsyringe";
import { CreateWallet } from "../dtos/create-wallet.dto";
import { addMinutes } from "date-fns";
import OTPRepo from "../repositories/otp.repo";
import { resetPasswordMail } from "@shared/mailer/resetPasswordMail";
import { IUser } from "../model/user.model";


@injectable()
class OTPService {
  constructor(private readonly otpRepo: OTPRepo) {}

  async sendOTP(data: { user: IUser, token: string, otpType: string }) {
    const OTP_VALIDITY_DURATION = 10; // OTP valid for 10 minutes
      const expiryDate = addMinutes(new Date(), OTP_VALIDITY_DURATION);
    //   const localExpiryDate = expiryDate.toLocaleString('en-US', { timeZone: 'Africa/Lagos' });
        console.log(expiryDate)
      const checkUnUsedOTP = await this.otpRepo.findOne({
        userId: data.user.id,
        status: 0,
      });
      if (checkUnUsedOTP) {
        const id = checkUnUsedOTP.id;
        await this.otpRepo.updateById(id, {
          token: data.token,
          expiringDatetime: expiryDate,
        });
      } else {
        await this.otpRepo.save({
          userId: data.user.id,
          token: data.token,
          status: 0,
          expiringDatetime: expiryDate,
          otpType: data.otpType,
        });
      }

      //send to the link via email
      const mail = {
        name: data.user?.name,
        email: data.user.email,
        subject: "Password Reset Notification",
        otp: data.token,
      };
      try {
        await resetPasswordMail(mail);
      } catch (e) {
        console.log(e);
      }
  }
}

export default OTPService;
