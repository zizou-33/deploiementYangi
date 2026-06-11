import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent {
  username = '';
  password = '';
  loading = false;
  error = '';
  showPassword = false;

  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}

  onSubmit() {
    if (!this.username || !this.password) {
      this.error = 'Veuillez remplir tous les champs.';
      return;
    }
    this.loading = true;
    this.error = '';

    this.auth.login({ username: this.username, password: this.password }).subscribe({
      next: () => {
        // Le token est sauvegardé, on récupère le profil pour avoir le rôle
        this.auth.getProfile().subscribe({
          next: (user) => {
            if (user.role === 'admin') this.router.navigate(['/admin/dashboard']);
            else if (user.role === 'driver') this.router.navigate(['/driver/dashboard']);
            else this.router.navigate(['/customer/dashboard']);
          },
          error: () => {
            this.error = 'Impossible de récupérer le profil.';
            this.loading = false;
          },
        });
      },
      error: () => {
        this.error = 'Identifiants incorrects. Veuillez réessayer.';
        this.loading = false;
      },
    });
  }
}
