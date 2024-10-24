import { SuccessResponse } from "@shared/utils/response.util";
import { Request, Response } from "express";
import { injectable } from "tsyringe";
import UserService from "../services/user.service";
import logger from "@shared/utils/logger";

@injectable()
class UserManagementController {
  constructor(private readonly userService: UserService) {}


  reactiveUserAccount = async (req: Request, res: Response) => {
    try {
      const result = await this.userService.reactivateUserAccount(req);
      if (result.success) {
        return res.send(SuccessResponse(result.message));
      } else {
        return res.status(400).json({ status: result.success, message: result.message });
      }
    } catch (error: any) {
      logger.error({error: error.message}, "Error deactivating user");
      return res.status(500).json({ status: false, message: "Failed to deactivate user account" });
    }
  };
  
}

export default UserManagementController;
