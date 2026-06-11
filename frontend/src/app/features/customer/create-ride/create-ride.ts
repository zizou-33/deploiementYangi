import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Subject, debounceTime, distinctUntilChanged, switchMap, of } from 'rxjs';
import { RideService } from '../../../core/services/ride';
import { SafeUrlPipe } from '../../../shared/pipes/safe-url.pipe';

interface Place {
  display_name: string;
  lat: string;
  lon: string;
}

@Component({
  selector: 'app-create-ride',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, SafeUrlPipe],
  templateUrl: './create-ride.html',
  styleUrl: './create-ride.scss',
})
export class CreateRideComponent {
  pickupQuery = '';
  pickupResults: Place[] = [];
  pickupSelected: Place | null = null;
  pickupLoading = false;

  destQuery = '';
  destResults: Place[] = [];
  destSelected: Place | null = null;
  destLoading = false;

  loading = false;
  error = '';
  success = '';

  private pickupSearch$ = new Subject<string>();
  private destSearch$ = new Subject<string>();

  private rideService = inject(RideService);
  private router = inject(Router);
  private http = inject(HttpClient);

  ngOnInit() {
    // Debounce 400ms pour ne pas spammer Nominatim
    this.pickupSearch$
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap((q) =>
          q.length >= 3
            ? this.http.get<Place[]>(
                `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=5&addressdetails=1`,
              )
            : of([]),
        ),
      )
      .subscribe({
        next: (data) => {
          this.pickupResults = data;
          this.pickupLoading = false;
        },
      });

    this.destSearch$
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap((q) =>
          q.length >= 3
            ? this.http.get<Place[]>(
                `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=5&addressdetails=1`,
              )
            : of([]),
        ),
      )
      .subscribe({
        next: (data) => {
          this.destResults = data;
          this.destLoading = false;
        },
      });
  }

  onPickupInput() {
    this.pickupSelected = null;
    if (this.pickupQuery.length >= 3) this.pickupLoading = true;
    else this.pickupResults = [];
    this.pickupSearch$.next(this.pickupQuery);
  }

  onDestInput() {
    this.destSelected = null;
    if (this.destQuery.length >= 3) this.destLoading = true;
    else this.destResults = [];
    this.destSearch$.next(this.destQuery);
  }

  selectPickup(place: Place) {
    this.pickupSelected = place;
    this.pickupQuery = place.display_name.split(',').slice(0, 3).join(',').trim();
    this.pickupResults = [];
    this.pickupLoading = false;
  }

  selectDest(place: Place) {
    this.destSelected = place;
    this.destQuery = place.display_name.split(',').slice(0, 3).join(',').trim();
    this.destResults = [];
    this.destLoading = false;
  }

  get mapUrl(): string {
    if (this.pickupSelected && this.destSelected) {
      const lat1 = parseFloat(this.pickupSelected.lat);
      const lon1 = parseFloat(this.pickupSelected.lon);
      const lat2 = parseFloat(this.destSelected.lat);
      const lon2 = parseFloat(this.destSelected.lon);
      return `https://www.openstreetmap.org/export/embed.html?bbox=${Math.min(lon1, lon2) - 0.02},${Math.min(lat1, lat2) - 0.02},${Math.max(lon1, lon2) + 0.02},${Math.max(lat1, lat2) + 0.02}&layer=mapnik`;
    }
    if (this.pickupSelected) {
      const lat = parseFloat(this.pickupSelected.lat);
      const lon = parseFloat(this.pickupSelected.lon);
      return `https://www.openstreetmap.org/export/embed.html?bbox=${lon - 0.02},${lat - 0.02},${lon + 0.02},${lat + 0.02}&layer=mapnik&marker=${lat},${lon}`;
    }
    return `https://www.openstreetmap.org/export/embed.html?bbox=11.48,3.83,11.53,3.87&layer=mapnik`;
  }

  reset() {
    this.pickupQuery = '';
    this.pickupResults = [];
    this.pickupSelected = null;
    this.destQuery = '';
    this.destResults = [];
    this.destSelected = null;
    this.error = '';
    this.success = '';
  }

  get canSubmit(): boolean {
    return !!this.pickupSelected && !!this.destSelected;
  }

  onSubmit() {
    if (!this.canSubmit) {
      this.error = 'Veuillez sélectionner un départ et une destination.';
      return;
    }
    this.loading = true;
    this.error = '';
    this.rideService
      .createRide({
        pickup_address: this.pickupQuery,
        pickup_lat: parseFloat(this.pickupSelected!.lat),
        pickup_lng: parseFloat(this.pickupSelected!.lon),
        destination_address: this.destQuery,
        destination_lat: parseFloat(this.destSelected!.lat),
        destination_lng: parseFloat(this.destSelected!.lon),
      })
      .subscribe({
        next: () => {
          this.success = 'Course créée ! Un chauffeur va vous être assigné.';
          this.loading = false;
          setTimeout(() => this.router.navigate(['/customer/history']), 2000);
        },
        error: (err) => {
          const e = err.error;
          if (Array.isArray(e)) this.error = e.join(' ');
          else if (typeof e === 'string') this.error = e;
          else if (e?.detail) this.error = e.detail;
          else if (e?.non_field_errors) this.error = e.non_field_errors.join(' ');
          else this.error = 'Erreur lors de la création.';
          this.loading = false;
        },
      });
  }
}
