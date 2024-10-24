// notification.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationCount = new BehaviorSubject<number>(0);
  currentNotificationCount = this.notificationCount.asObservable();

  private notifications: string[] = [];

  constructor() { }

  addNotification(action: string, entityType: string) {
    const firstLetter = entityType.charAt(0).toUpperCase(); // Obtém a primeira letra do tipo de entidade
    const message = `${firstLetter} - Você ${action} um(a) ${entityType}.`;
    this.notifications.push(message);
    this.notificationCount.next(this.notifications.length);
  }

  getNotifications(): string[] {
    return this.notifications;
  }

  clearNotifications() {
    this.notifications = [];
    this.notificationCount.next(0);
  }
}
