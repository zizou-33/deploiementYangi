import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../../core/services/admin';
import { AuthService } from '../../../core/services/auth';
import { Ride } from '../../../core/models/ride.model';

@Component({
  selector: 'app-admin-rides',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './rides.html',
  styleUrl: './rides.scss',
})
export class RidesComponent {
  rides: Ride[] = [];
  loading = true;
  filter = 'all';

  private admin = inject(AdminService);
  private auth = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.admin.getRides().subscribe({
      next: (r) => {
        this.rides = r;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  get filtered() {
    if (this.filter === 'all') return this.rides;
    return this.rides.filter((r) => r.status === this.filter);
  }

  logout() {
    this.auth.logout();
  }
}
