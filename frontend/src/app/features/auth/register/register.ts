import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class RegisterComponent {
  form = {
    username: '',
    email: '',
    password: '',
    phone: '',
  };
  confirmPassword = '';
  loading = false;
  error = '';
  success = '';
  showPassword = false;

  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}

  onSubmit() {
    if (!this.form.username || !this.form.email || !this.form.password || !this.form.phone) {
      this.error = 'Veuillez remplir tous les champs.';
      return;
    }
    if (this.form.password !== this.confirmPassword) {
      this.error = 'Les mots de passe ne correspondent pas.';
      return;
    }
    if (this.form.password.length < 8) {
      this.error = 'Le mot de passe doit contenir au moins 8 caractères.';
      return;
    }
    this.loading = true;
    this.error = '';
    this.auth.register(this.form).subscribe({
      next: () => {
        this.success = 'Compte créé avec succès ! Redirection...';
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err) => {
        this.error =
          err.error?.username?.[0] || err.error?.email?.[0] || 'Une erreur est survenue.';
        this.loading = false;
      },
    });
  }
}
