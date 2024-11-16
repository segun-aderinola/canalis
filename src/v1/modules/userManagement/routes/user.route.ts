import express, { Request, Response } from "express";
import { container } from "tsyringe";
import UserController from "../controller/user.controller";

import { createUserRules } from "../validations/create-user.validator";
import validate from "@shared/middlewares/validator.middleware";

import adminAuthMiddleware from "@shared/middlewares/admin.auth.middleware";

const userController = container.resolve(UserController);
const router = express.Router();

// admin create new users
router.post("/admin/create-user", [adminAuthMiddleware, validate(createUserRules)], (req: Request, res: Response, next) => userController.createUser(req, res).catch((err)=> next(err) )
);

export default router;
