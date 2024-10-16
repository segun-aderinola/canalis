import logger from "@shared/utils/logger";
import { injectable } from "tsyringe";
import { IDVerification } from "../model/id_verification.mdel";
import IDVerificationFactory from "../factories/id_verification.factory";
import IDVerificationRepo from "../repositories/id_verification.repo";
@injectable()
class IDVerificationService {
  constructor(private readonly idVerificationRepo: IDVerificationRepo) {}

  async idVerification(data: { userId: string; idNumber: string; idType: string }) {
    try {
      // Simulate calling a third-party service to verify the ID
      const result = {
        userId: data.userId,
        issuingDate: "20-10-2009",
        expiringDate: "20-10-2029",
        idType: data.idType,
        idNumber: data.idNumber,
      };
  
      // Log the verification result without passing 'res'
      const logID = await this.logVerification(result);
  
      // Return the log ID or result for further use if needed
      return logID;
    } catch (error: any) {
      // Instead of returning res, throw an error for the controller to handle
      throw new Error(`ID verification failed: ${error.message}`);
    }
  }
  

  async logVerification(data) {
    const user = IDVerificationFactory.idVerification(data);
    try {
      // Save the verification log to the repository
      const logID = await this.idVerificationRepo.save(user);
  
      // Return log ID for use in other parts of the service/controller
      return logID;
    } catch (error: any) {
      // Throw an error instead of handling HTTP response here
      throw new Error(`Logging verification failed: ${error.message}`);
    }
  }
}
  

export default IDVerificationService;
