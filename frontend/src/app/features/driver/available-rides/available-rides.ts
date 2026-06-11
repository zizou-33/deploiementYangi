import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RideService } from '../../../core/services/ride';
import { AuthService } from '../../../core/services/auth';
import { Ride } from '../../../core/models/ride.model';

@Component({
  selector: 'app-available-rides',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './available-rides.html',
  styleUrl: './available-rides.scss',
})
export class AvailableRidesComponent {
  rides: Ride[] = [];
  loading = true;
  currentRide: Ride | null = null;
  selectedRide: Ride | null = null;
  actionLoading = false;
  msg = '';
  msgType: 'success' | 'error' = 'success';

  private rideService = inject(RideService);
  private auth = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading = true;
    // Cherche course en cours
    this.rideService.getDriverHistory().subscribe({
      next: (rides) => {
        this.currentRide =
          rides.find((r) => r.status === 'accepted' || r.status === 'in_progress') || null;
        this.cdr.detectChanges();
      },
    });
    // Courses disponibles
    this.rideService.getAvailableRides().subscribe({
      next: (rides) => {
        this.rides = rides;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  accept(ride: Ride) {
    this.actionLoading = true;
    this.rideService.acceptRide(ride.id).subscribe({
      next: (res) => {
        this.showMsg(res.message, 'success');
        this.actionLoading = false;
        this.load();
      },
      error: (err) => {
        this.showMsg(err.error?.detail || 'Erreur', 'error');
        this.actionLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  start(id: number) {
    this.actionLoading = true;
    this.rideService.startRide(id).subscribe({
      next: (res) => {
        this.showMsg(res.message, 'success');
        this.actionLoading = false;
        this.load();
      },
      error: (err) => {
        this.showMsg(err.error?.detail || 'Erreur', 'error');
        this.actionLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  complete(id: number) {
    this.actionLoading = true;
    this.rideService.completeRide(id).subscribe({
      next: (res) => {
        this.showMsg(res.message, 'success');
        this.actionLoading = false;
        this.currentRide = null;
        this.load();
      },
      error: (err) => {
        this.showMsg(err.error?.detail || 'Erreur', 'error');
        this.actionLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  cancel(id: number) {
    this.actionLoading = true;
    this.rideService.cancelRide(id).subscribe({
      next: () => {
        this.showMsg('Course annulée', 'success');
        this.actionLoading = false;
        this.currentRide = null;
        this.load();
      },
      error: () => {
        this.actionLoading = false;
        this.cdr.detectChanges();
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

  logout() {
    this.auth.logout();
  }
}
