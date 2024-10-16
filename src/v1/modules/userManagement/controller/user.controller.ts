import { ErrorResponse, SuccessResponse } from "@shared/utils/response.util";
import { Request, Response } from "express";
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
      res.status(500).json(ErrorResponse("Internal Server: ", error));
    } 
  };
  createUser = async(req: Request, res) => {
    try {
      const users: any  = await this.userService.createUser(req.body, res);
      res.send(SuccessResponse("Operation successful", users));
    } catch (error: any) {
      res.status(500).json(ErrorResponse("Internal Server: ", error));
    }
    
  };
  uploadBulkUser = async(req: Request, res: Response) => {
    try {
      const result: any  = await this.userService.uploadBulkUser(req);
      return res.send(SuccessResponse("Operation successful", result));
    } catch (error: any) {
      res.status(500).json(ErrorResponse("Bulk upload failed", error));
    }
    
  };

  deactiveUserAccount = async (req: Request, res: Response) => {
    try {
      const result = await this.userService.deactivateUserAccount(req);
      if (result.success) {
        return res.send(SuccessResponse(result.message));
      } else {
        return res.status(400).json({ status: result.success, message: result.message });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: false, message: "Failed to deactivate user account" });
    }
  };

  reactiveUserAccount = async (req: Request, res: Response) => {
    try {
      const result = await this.userService.reactivateUserAccount(req);
      if (result.success) {
        return res.send(SuccessResponse(result.message, result.data));
      } else {
        return res.status(400).json({ status: result.success, message: result.message });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: false, message: "Failed to deactivate user account" });
    }
  };
  
}

export default UserManagementController;
