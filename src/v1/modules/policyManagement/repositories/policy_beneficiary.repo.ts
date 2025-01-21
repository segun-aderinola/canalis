import { injectable } from "tsyringe";
import { BaseRepository } from "./base.repo";
import { IPolicyBeneficiary, PolicyBeneficiary } from "../model/policy_beneficiary.model";


@injectable()
class PolicyBeneficiaryRepository extends BaseRepository<IPolicyBeneficiary, PolicyBeneficiary> {
  constructor() {
    super(PolicyBeneficiary);
  }
}

export default PolicyBeneficiaryRepository;
