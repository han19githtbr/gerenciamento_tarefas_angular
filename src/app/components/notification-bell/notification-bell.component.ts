// notification-bell.component.ts
import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-notification-bell',
  templateUrl: './notification-bell.component.html',
  styleUrls: ['./notification-bell.component.css']
})
export class NotificationBellComponent implements OnInit {
  notificationCount: number = 0;
  lastNotification: string = ''; // Adicionando a propriedade lastNotification

  constructor(private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.notificationService.currentNotificationCount.subscribe(count => {
      this.notificationCount = count;
    });
  }

  showNotifications() {
    const notifications = this.notificationService.getNotifications();
    if (notifications.length > 0) {
      // Define a última notificação como a primeira letra da última mensagem
      this.lastNotification = notifications[notifications.length - 1].charAt(0);
    }
    // Mostra as notificações (apenas a primeira letra) usando o ToastrService ou outro método de exibição de notificações
    for (const notification of notifications) {
      const firstLetter = notification.charAt(0); // Obtém a primeira letra da notificação
      console.log(firstLetter); // Exibe a primeira letra no console (substitua por sua lógica de exibição real)
    }
    // Limpa as notificações após serem exibidas
    this.notificationService.clearNotifications();
  }
}








