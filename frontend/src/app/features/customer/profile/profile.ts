import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class ProfileComponent {
  user: User | null = null;
  form = { username: '', email: '', phone: '' };
  pwForm = { old_password: '', new_password: '', confirm: '' };
  editMode = false;
  loading = false;
  pwLoading = false;
  success = '';
  error = '';
  pwSuccess = '';
  pwError = '';
  showPw = false;

  private auth = inject(AuthService);

  ngOnInit() {
    // Affichage immédiat depuis cache
    const cached = this.auth.currentUser;
    if (cached) {
      this.user = cached;
      this.form = { username: cached.username, email: cached.email, phone: cached.phone };
    }
    // Sync avec le backend en arrière-plan
    this.auth.getProfile().subscribe({
      next: (u) => {
        this.user = u;
        this.form = { username: u.username, email: u.email, phone: u.phone };
      },
      error: () => {},
    });
  }

  enableEdit() {
    this.editMode = true;
    this.success = '';
    this.error = '';
  }

  cancelEdit() {
    this.editMode = false;
    if (this.user) {
      this.form = { username: this.user.username, email: this.user.email, phone: this.user.phone };
    }
    this.success = '';
    this.error = '';
  }

  updateProfile() {
    this.loading = true;
    this.success = '';
    this.error = '';
    this.auth.updateProfile(this.form).subscribe({
      next: (u) => {
        this.user = u;
        this.success = 'Profil mis à jour !';
        this.loading = false;
        this.editMode = false;
      },
      error: () => {
        this.error = 'Erreur lors de la mise à jour.';
        this.loading = false;
      },
    });
  }

  changePassword() {
    if (this.pwForm.new_password !== this.pwForm.confirm) {
      this.pwError = 'Les mots de passe ne correspondent pas.';
      return;
    }
    this.pwLoading = true;
    this.pwSuccess = '';
    this.pwError = '';
    this.auth
      .changePassword({
        old_password: this.pwForm.old_password,
        new_password: this.pwForm.new_password,
      })
      .subscribe({
        next: () => {
          this.pwSuccess = 'Mot de passe modifié avec succès !';
          this.pwLoading = false;
          this.pwForm = { old_password: '', new_password: '', confirm: '' };
        },
        error: () => {
          this.pwError = 'Ancien mot de passe incorrect.';
          this.pwLoading = false;
        },
      });
  }

  logout() {
    this.auth.logout();
  }
}
