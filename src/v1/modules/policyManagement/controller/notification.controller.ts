import { Response, Request } from "express";
import { injectable } from "tsyringe";
import { ErrorResponse, SuccessResponse } from "@shared/utils/response.util";
import NotificationService from "../services/notification.service";

@injectable()
class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}


  getAllNotifications = async (req: Request, res: Response) => {
    try {
      const notifications = await this.notificationService.getAll(req);
      res.send(SuccessResponse("Operation successful", notifications));
    } catch (error: any) {
      res.status(500).json(ErrorResponse("Internal Server Error: ", error.message));
    }
  };
}

export default NotificationController;
