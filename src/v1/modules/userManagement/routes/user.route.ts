import express, { Request, Response } from "express";
import { container } from "tsyringe";
import UserController from "../controller/user.controller";
import { createUserRules } from "../validations/create-user.validator";
import validate from "@shared/middlewares/validator.middleware";
import multer from 'multer';
import { updateUserRules } from "../validations/update-user.validator";
const upload = multer({ dest: 'uploads/' });

const userController = container.resolve(UserController);
const router = express.Router();

// admin create new users
router.post("/admin/create-user", validate(createUserRules), (req: Request, res: Response) => {
  userController.createUser(req, res);
});

router.put("/admin/update-user/:id", validate(updateUserRules), (req: Request, res: Response) => {
  userController.updateUser(req, res);
});


router.post("/admin/upload-bulk-user", upload.single('users'), (req: Request, res: Response) => {
  userController.uploadBulkUser(req, res);
});


router.get("/admin/fetch-users", (req: Request, res: Response) => {
  userController.getAll(req, res);
});


router.post("/admin/deactivate-user/:id", (req: Request, res: Response) => {
  userController.deactiveUserAccount(req, res);
});

router.post("/admin/reactivate-user/:id", (req: Request, res: Response) => {
  userController.reactiveUserAccount(req, res);
});

router.get("/admin/export-users", (req: Request, res: Response) => {
  userController.exportUserToCSV(req, res);
});

export default router;
