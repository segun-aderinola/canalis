import { injectable } from "tsyringe";
import { BaseRepository } from "./base.repo";
import { INotification, Notification } from "../model/notification.model";

@injectable()
class NotificationRepository extends BaseRepository<INotification, Notification> {
  constructor() {
    super(Notification);
  }
}

export default NotificationRepository;
