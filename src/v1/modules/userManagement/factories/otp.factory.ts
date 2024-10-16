// import { ObjectLiteral } from "@shared/types/object-literal.type";
import { CreateOTP } from "../dtos/create-otp.dto";
import { IOTP } from "../model/otp.mdel";


class OTPFactory {
  static createOTP(data: CreateOTP) {
    const otp = {} as IOTP;

    otp.userId = data.userId;
    otp.token = data.token;
    otp.otpType = data.otpType;
    otp.status = 0;
    otp.expiringDatetime = data.expiringDatetime;
    
    

    return otp;
  }
}

export default OTPFactory;
