import { SuccessResponse } from "@shared/utils/response.util";
import { Request } from "express";
import { injectable } from "tsyringe";
import UserService from "../services/user.service";

@injectable()
class UserManagementController {
  constructor(private readonly userService: UserService) {}

  getAll = async (req: Request, res) => {
    try {
      const users = await this.userService.getAll();
      // if(users.)
      res.send(SuccessResponse("Operation successful", users));
    } catch (error: any) {
      console.log(error)
      // res.send(ErrorResponse("Operation successful", error));
    }
    
  };
  createUser = async(req: Request, res) => {
    try {
      const users: any  = await this.userService.createUser(req.body, res);
      res.send(SuccessResponse("Operation successful", users));
    } catch (error) {
      console.log(error)
    }
    
  };
  uploadBulkUser = async(req: Request, res) => {
    try {
      const users: any  = await this.userService.uploadBulkUser(req.body, res, req);
      res.send(SuccessResponse("Operation successful", users));
    } catch (error) {
      console.log(error)
    }
    
  };
}

export default UserManagementController;
