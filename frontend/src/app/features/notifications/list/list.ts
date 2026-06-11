import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NotificationService } from '../../../core/services/notification';
import { AuthService } from '../../../core/services/auth';
import { Notification } from '../../../core/models/notification.model';

@Component({
  selector: 'app-notification-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './list.html',
  styleUrl: './list.scss',
})
export class NotificationListComponent {
  notifications: Notification[] = [];
  loading = true;

  private notifService = inject(NotificationService);
  private auth = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.notifService.getAll().subscribe({
      next: (n) => {
        this.notifications = n;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  get unreadCount() {
    return this.notifications.filter((n) => !n.is_read).length;
  }

  markRead(notif: Notification) {
    if (notif.is_read) return;
    this.notifService.markAsRead(notif.id).subscribe({
      next: () => {
        notif.is_read = true;
        this.cdr.detectChanges();
      },
    });
  }

  logout() {
    this.auth.logout();
  }

  protected readonly history = history;
}
