import { CreateNotification } from "../dtos/notification.dto";
import { Notification } from "../model/notification.model";

class NotificationFactory {
  static createNotification(data: CreateNotification): Notification {
    const notification = {} as Notification;
  
    notification.userId = data.userId;
    notification.policyId = data.policyId;
    notification.data = data.data;
  
    return notification;
  }
}

export default NotificationFactory;
