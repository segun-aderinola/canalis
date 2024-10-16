import express, { Request, Response } from "express";
import { container } from "tsyringe";
import UserController from "../controller/user.controller";
import { createUserRules } from "../validations/create-user.validator";
import validate from "@shared/middlewares/validator.middleware";
import multer from 'multer';
const upload = multer({ dest: 'uploads/' });

const userController = container.resolve(UserController);
const router = express.Router();

// admin create new users
router.post("/admin/create-user", validate(createUserRules), (req: Request, res: Response) => {
  userController.createUser(req, res);
});


export default router;
