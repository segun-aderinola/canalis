import { injectable } from "tsyringe";
import { BaseRepository } from "./base.repo";
import { IPolicy, Policy } from "../model/policy.model";

@injectable()
class PolicyRepository extends BaseRepository<IPolicy, Policy> {
  constructor() {
    super(Policy);
  }
}

export default PolicyRepository;
