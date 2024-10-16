import { ErrorResponse, SuccessResponse } from "@shared/utils/response.util";
import { Request } from "express";
import { injectable } from "tsyringe";
import UserService from "../services/user.service";

@injectable()
class UserManagementController {
  constructor(private readonly userService: UserService) {}

  getAll = async (req: Request, res) => {
    try {
      const users = await this.userService.getAllUsers(req);
      res.send(SuccessResponse("Operation successful", users));
    } catch (error: any) {
      res.status(500).json(ErrorResponse("Internal Server Error: ", error.message));
    } 
  };
  createUser = async(req: Request, res) => {
    try {
      const users: any  = await this.userService.createUser(req.body, res);
      res.send(SuccessResponse("Operation successful", users));
    } catch (error: any) {
      res.status(500).json(ErrorResponse("Internal Server Error: ", error.message));
    }
    
  };
}

export default UserManagementController;
