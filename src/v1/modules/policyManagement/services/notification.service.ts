import logger from "@shared/utils/logger";
import { injectable } from "tsyringe";
import { CreateNotification } from "../dtos/notification.dto";
import { INotification } from "../model/notification.model";
import NotificationRepository from "../repositories/notification.repository";
import NotificationFactory from "../factories/notification.factory";
@injectable()
class NotificationService {
  constructor(
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async createNotification(data: CreateNotification) {
    const notification = NotificationFactory.createNotification(data);

    return await this.notificationRepository
    .save(notification)
    .catch((error) => this.handleNotificationError(notification, error));
  }

  public async getAll(req: any) {
    return await this.notificationRepository.findWhere({ userId: req.user.userId });
  }

  private handleNotificationError = (notification: INotification, error: any) => {
    console.log(error);
    logger.error(
      { error, notification },
      "NotificationService[handleNotificationError]: Error occured creating Notification."
    );
  };
}

export default NotificationService;
