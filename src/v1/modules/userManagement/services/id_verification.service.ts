import logger from "@shared/utils/logger";
import { injectable } from "tsyringe";
import { IDVerification } from "../model/id_verification.mdel";
import IDVerificationFactory from "../factories/id_verification.factory";
import IDVerificationRepo from "../repositories/id_verification.repo";
@injectable()
class IDVerificationService {
  constructor(private readonly idVerificationRepo: IDVerificationRepo) {}

  async idVerification(data: {userId: string, idNumber: string, idType: string}, res) {    
    
    try {
      // call a service here to verify the id
      
      const result = {
        userId: data.userId,
        issuingDate: "20-10-2009",
        expiringDate: "20-10-2029",
        idType: data.idType,
        idNumber: data.idNumber
      }
      await this.logVerification(result, res)
      
    } catch (error: any) {
      return res.status(500).json({ status: false, message: error.message })
    }
  }

  async logVerification(data, res) {    
    const user = IDVerificationFactory.idVerification(data);
    try {
      const logID = await this.idVerificationRepo.save(user);

      return logID;
    } catch (error: any) {
      return res.status(500).json({ status: false, message: error.message })
    }
  }

  async getAll() {
    return await this.idVerificationRepo.getAll();
  }

}

export default IDVerificationService;
