import { IdVerification } from "../dtos/create-id-verification.dto";
import { IDV } from "../model/id_verification.model";


class IdVerificationFactory {
  static idVerification(data: IdVerification) {
    const idVerification = {} as IDV;

    idVerification.userId = data.userId;
    idVerification.issuingDate = data.issuingDate;
    idVerification.expiringDate = data.expiringDate;
    idVerification.idType = data.idType;
    idVerification.idNumber = data.idNumber;
    
    return idVerification;
  }
}

export default IdVerificationFactory;
