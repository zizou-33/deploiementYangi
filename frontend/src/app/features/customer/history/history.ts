import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { RideService } from '../../../core/services/ride';
import { AuthService } from '../../../core/services/auth';
import { Ride } from '../../../core/models/ride.model';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './history.html',
  styleUrl: './history.scss'
})
export class HistoryComponent {
  rides: Ride[] = [];
  loading = true;
  error = '';
  selectedRide: Ride | null = null;
  showReviewModal = false;
  rating = 5;
  comment = '';
  reviewLoading = false;
  reviewSuccess = '';

  private rideService = inject(RideService);
  private auth = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.rideService.getCustomerHistory().subscribe({
      next: (rides) => { this.rides = rides; this.loading = false; this.cdr.detectChanges(); },
      error: () => { this.error = 'Impossible de charger l\'historique.'; this.loading = false; this.cdr.detectChanges(); }
    });
  }

  openDetail(ride: Ride) {
    this.selectedRide = ride;
    this.showReviewModal = false;
    this.cdr.detectChanges();
  }

  cancelRide(id: number) {
    this.rideService.cancelRide(id).subscribe({
      next: () => { this.load(); this.selectedRide = null; this.cdr.detectChanges(); }
    });
  }

  openReview(ride: Ride) {
    this.selectedRide = ride;
    this.showReviewModal = true;
    this.rating = 5;
    this.comment = '';
    this.reviewSuccess = '';
    this.cdr.detectChanges();
  }

  get ratingLabel(): string {
    const labels = ['', 'Très mauvais', 'Mauvais', 'Correct', 'Bien', 'Excellent'];
    return labels[this.rating] || '';
  }

  submitReview() {
    if (!this.selectedRide) return;
    this.reviewLoading = true;
    this.rideService.reviewRide(this.selectedRide.id, { rating: this.rating, comment: this.comment }).subscribe({
      next: () => {
        this.reviewSuccess = 'Avis envoyé avec succès !';
        this.reviewLoading = false;
        this.cdr.detectChanges();
        setTimeout(() => { this.showReviewModal = false; this.selectedRide = null; this.cdr.detectChanges(); }, 1800);
      },
      error: () => { this.reviewLoading = false; this.cdr.detectChanges(); }
    });
  }

  logout() { this.auth.logout(); }
}
