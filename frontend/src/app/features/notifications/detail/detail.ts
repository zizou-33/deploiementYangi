import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { NotificationService } from '../../../core/services/notification';
import { Notification } from '../../../core/models/notification.model';

@Component({
  selector: 'app-notification-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './detail.html',
  styleUrl: './detail.scss',
})
export class NotificationDetailComponent {
  notif: Notification | null = null;
  loading = true;

  private notifService = inject(NotificationService);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.notifService.getDetail(id).subscribe({
      next: (n) => {
        this.notif = n;
        this.loading = false;
        this.cdr.detectChanges();
        // Marquer comme lu automatiquement
        if (!n.is_read) {
          this.notifService.markAsRead(id).subscribe();
        }
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }
}
