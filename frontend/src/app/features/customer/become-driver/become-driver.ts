import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { DriverService } from '../../../core/services/driver';

@Component({
  selector: 'app-become-driver',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './become-driver.html',
  styleUrl: './become-driver.scss',
})
export class BecomeDriverComponent {
  form = {
    motivation: '',
    id_card_number: '',
    car_brand: '',
    car_model: '',
    car_color: '',
    plate_number: '',
  };
  loading = false;
  success = '';
  error = '';

  private driverService = inject(DriverService);
  private router = inject(Router);

  onSubmit() {
    const f = this.form;
    if (
      !f.motivation ||
      !f.id_card_number ||
      !f.car_brand ||
      !f.car_model ||
      !f.car_color ||
      !f.plate_number
    ) {
      this.error = 'Veuillez remplir tous les champs.';
      return;
    }
    this.loading = true;
    this.error = '';
    this.driverService.submitRequest(this.form).subscribe({
      next: () => {
        this.success = 'Candidature envoyée ! Elle sera examinée par un administrateur.';
        this.loading = false;
        setTimeout(() => this.router.navigate(['/customer/dashboard']), 2500);
      },
      error: (err) => {
        this.error = err.error?.plate_number?.[0] || err.error?.detail || "Erreur lors de l'envoi.";
        this.loading = false;
      },
    });
  }
}
