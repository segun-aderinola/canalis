import { SuccessResponse } from "@shared/utils/response.util";
import { injectable } from "tsyringe";
import AuditTrailService from "../services/audit-trail.service";

@injectable()
class AuditTrailController {
  constructor(private readonly auditTrailService: AuditTrailService) {}

  getAll = async (res) => {
    const auditTrails = await this.auditTrailService.getAll();

    res.send(SuccessResponse("Operation successful", auditTrails));
  };
}

export default AuditTrailController;
