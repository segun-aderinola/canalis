import { ErrorResponse, SuccessResponse } from "@shared/utils/response.util";
import { Request, Response } from "express";
import { injectable } from "tsyringe";
import UserService from "../services/user.service";
import AuthService from "../services/auth.service";

@injectable()
class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService
  ) {}

  forgetPassword = async(req: Request, res) => {
    try {
      const result: any  = await this.authService.forgetPassword(req.body);
      if (result.success) {
        return res.send(SuccessResponse(result.message));
      } else {
        return res.status(400).json({ status: result.success, message: result.message });
      }
    } catch (error: any) {
      res.status(500).json(ErrorResponse("Internal Server: ", error));
    }
  };
  confirmOTP = async(req: Request, res) => {
    try {
      const result: any  = await this.authService.confirmOtp(req.body);
      if (result.success) {
        return res.send(SuccessResponse(result.message));
      } else {
        return res.status(400).json({ status: result.success, message: result.message });
      }
    } catch (error: any) {
      res.status(500).json(ErrorResponse("Internal Server: ", error));
    }
    
  };

  passwordReset = async(req: Request, res) => {
    try {
      const result: any  = await this.authService.resetPassword(req.body);
      if (result.success) {
        return res.send(SuccessResponse(result.message));
      } else {
        return res.status(400).json({ status: result.success, message: result.message });
      }
    } catch (error: any) {
      res.status(500).json(ErrorResponse("Internal Server: ", error));
    }
    
  };

  createPassword = async(req: Request, res) => {
    try {
      const result: any  = await this.authService.changePasswordOnFirstLogin(req.body);
      if (result.success) {
        return res.send(SuccessResponse(result.message, result.data));
      } else {
        return res.status(400).json({ status: result.success, message: result.message });
      }
    } catch (error: any) {
      res.status(500).json(ErrorResponse("Internal Server: ", error));
    }
    
  };

  login = async(req: Request, res) => {
    try {
      const result: any  = await this.authService.login(req.body);
      if (result.success) {
        return res.send(SuccessResponse(result.message, result.data));
      } else {
        return res.status(400).json({ status: result.success, message: result.message, data: result.data });
      }
    } catch (error: any) {
      res.status(500).json(ErrorResponse("Internal Server: ", error));
    }
    
  };
}

export default AuthController;
