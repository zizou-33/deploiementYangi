import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../../core/services/admin';
import { AuthService } from '../../../core/services/auth';
import { DriverRequest } from '../../../core/models/driver-request.model';

@Component({
  selector: 'app-admin-requests',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './requests.html',
  styleUrl: './requests.scss'
})
export class RequestsComponent {
  requests: DriverRequest[] = [];
  loading = true;
  msg = '';
  msgType: 'success' | 'error' = 'success';
  actionLoading: { [id: number]: boolean } = {};

  private admin = inject(AdminService);
  private auth = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.admin.getRequests().subscribe({
      next: (r) => { this.requests = r; this.loading = false; this.cdr.detectChanges(); },
      error: () => { this.loading = false; this.cdr.detectChanges(); }
    });
  }

  approve(id: number) {
    this.actionLoading[id] = true;
    this.admin.approveRequest(id).subscribe({
      next: (r) => { this.showMsg(r.message, 'success'); this.actionLoading[id] = false; this.load(); },
      error: (err) => {
        const msg = err.error?.plate_number || err.error?.detail || 'Erreur';
        this.showMsg(Array.isArray(msg) ? msg[0] : msg, 'error');
        this.actionLoading[id] = false;
        this.cdr.detectChanges();
      }
    });
  }

  decline(id: number) {
    this.actionLoading[id] = true;
    this.admin.declineRequest(id).subscribe({
      next: (r) => { this.showMsg(r.message, 'success'); this.actionLoading[id] = false; this.load(); },
      error: () => { this.showMsg('Erreur', 'error'); this.actionLoading[id] = false; this.cdr.detectChanges(); }
    });
  }

  showMsg(msg: string, type: 'success' | 'error') {
    this.msg = msg; this.msgType = type; this.cdr.detectChanges();
    setTimeout(() => { this.msg = ''; this.cdr.detectChanges(); }, 4000);
  }

  get pending() { return this.requests.filter(r => r.status === 'pending'); }
  get processed() { return this.requests.filter(r => r.status !== 'pending'); }

  logout() { this.auth.logout(); }
}
