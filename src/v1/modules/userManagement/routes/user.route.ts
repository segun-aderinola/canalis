import express, { Request, Response } from "express";
import { container } from "tsyringe";
import UserController from "../controller/user.controller";
import adminAuthMiddleware from "@shared/middlewares/admin.auth.middleware";


const userController = container.resolve(UserController);
const router = express.Router();


router.post("/admin/reactivate-user/:id", adminAuthMiddleware, (req: Request, res: Response) => {
  userController.reactiveUserAccount(req, res);
});


export default router;
