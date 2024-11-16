import { Request, Response } from "express";
import { injectable } from "tsyringe";
import UserService from "../services/user.service";
import httpStatus from "http-status";

@injectable()
class UserManagementController {
  constructor(private readonly userService: UserService) {}

  createUser = async(req: Request, res: Response) => {
    const result: any  = await this.userService.createUser(req.body);
    return res.status(result.success ? httpStatus.OK : httpStatus.BAD_REQUEST).json(result);
  }
}

export default UserManagementController;
