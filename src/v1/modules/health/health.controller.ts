import { Request, Response } from "express";
import { injectable } from "tsyringe";
import HealthService from "./health.service";

@injectable()
class HealthController {
  constructor(private healthService: HealthService) {}

  readinessCheck = async (req: Request, res: Response) => {
    await this.healthService.readinessCheck(req, res);
  };

  livelinessCheck = async (req: Request, res: Response) => {
    await this.healthService.livelinessCheck(req, res);
  };
}

export default HealthController;
