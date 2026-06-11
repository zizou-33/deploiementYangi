import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../../core/services/admin';
import { AuthService } from '../../../core/services/auth';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './users.html',
  styleUrl: './users.scss',
})
export class UsersComponent {
  users: User[] = [];
  loading = true;
  msg = '';
  msgType: 'success' | 'error' = 'success';

  private admin = inject(AdminService);
  private auth = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.load();
  }

  load() {
    this.admin.getUsers().subscribe({
      next: (u) => {
        this.users = u;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  block(id: number) {
    this.admin.blockUser(id).subscribe({
      next: (r) => {
        this.showMsg(r.message, 'success');
        this.load();
      },
      error: () => {
        this.showMsg('Erreur', 'error');
      },
    });
  }

  unblock(id: number) {
    this.admin.unblockUser(id).subscribe({
      next: (r) => {
        this.showMsg(r.message, 'success');
        this.load();
      },
      error: () => {
        this.showMsg('Erreur', 'error');
      },
    });
  }

  showMsg(msg: string, type: 'success' | 'error') {
    this.msg = msg;
    this.msgType = type;
    this.cdr.detectChanges();
    setTimeout(() => {
      this.msg = '';
      this.cdr.detectChanges();
    }, 3000);
  }

  roleColor(role: string) {
    if (role === 'admin') return 'red';
    if (role === 'driver') return 'blue';
    return 'green';
  }

  logout() {
    this.auth.logout();
  }
}
