import express, { Request, Response } from "express";
import { container } from "tsyringe";
import UserController from "../controller/user.controller";
import { createUserRules } from "../validations/create-user.validator";
import { profilePictureUploadRules } from "../validations/profile-picture.validator";
import adminAuthMiddleware from "@shared/middlewares/admin.auth.middleware";
import { uploadBulkUserRules } from "../validations/create-bulk-user.validator";
import {validate, validateArray} from "@shared/middlewares/validator.middleware";
import { updateUserRules } from "../validations/update-user.validator";
import authMiddleware from "@shared/middlewares/auth.middleware";
import { signatureUploadRules } from "../validations/signature.validator";


const userController = container.resolve(UserController);
const router = express.Router();

router.post("/admin/create-user", [validate(createUserRules)], (req: Request, res: Response, next) => userController.createUser(req, res).catch((err)=> next(err) )
);

router.post("/admin/upload-bulk-user", [adminAuthMiddleware, validateArray(uploadBulkUserRules)], (req: Request, res: Response) => 
  userController.uploadBulkUser(req, res)
);

router.get("/admin/fetch-users", adminAuthMiddleware, (req: Request, res: Response) => {
  userController.getAll(req, res);
});

router.get("/admin/export-users", adminAuthMiddleware, (req: Request, res: Response) => {
  userController.exportUserToCSV(req, res);
});

router.post("/admin/reactivate-user/:id", adminAuthMiddleware, (req: Request, res: Response) => {
  userController.reactiveUserAccount(req, res);
});

router.post("/admin/deactivate-user/:id", adminAuthMiddleware, (req: Request, res: Response) => {
  userController.deactiveUserAccount(req, res);
});

router.put("/admin/update-user/:id", [adminAuthMiddleware, validate(updateUserRules)], (req: Request, res: Response) => {
  userController.updateUser(req, res);
});

router.post("/dashboard/upload-signature", [authMiddleware, validate(signatureUploadRules)], (req: Request, res: Response, next) => userController.uploadSignature(req, res).catch((err)=> next(err) ))

router.post("/dashboard/upload-profile-pic", [authMiddleware, validate(profilePictureUploadRules)], (req: Request, res: Response, next) => userController.profilePictureUpload(req, res).catch((err)=> next(err) )
);
export default router;
