import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { DriverService } from '../../../core/services/driver';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-driver-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class ProfileComponent {
  user: User | null = null;
  driverProfile: any = null;
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
  private driverService = inject(DriverService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.user = this.auth.currentUser;
    if (this.user) {
      this.form = { username: this.user.username, email: this.user.email, phone: this.user.phone };
    }
    this.auth.getProfile().subscribe({
      next: (u) => {
        this.user = u;
        this.form = { username: u.username, email: u.email, phone: u.phone };
        this.cdr.detectChanges();
      },
    });
    this.driverService.getProfile().subscribe({
      next: (p) => {
        this.driverProfile = p;
        this.cdr.detectChanges();
      },
      error: () => {},
    });
  }

  enableEdit() {
    this.editMode = true;
  }

  cancelEdit() {
    this.editMode = false;
    if (this.user)
      this.form = { username: this.user.username, email: this.user.email, phone: this.user.phone };
  }

  updateProfile() {
    this.loading = true;
    this.auth.updateProfile(this.form).subscribe({
      next: (u) => {
        this.user = u;
        this.success = 'Profil mis à jour !';
        this.loading = false;
        this.editMode = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Erreur.';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  changePassword() {
    if (this.pwForm.new_password !== this.pwForm.confirm) {
      this.pwError = 'Mots de passe différents.';
      return;
    }
    this.pwLoading = true;
    this.auth
      .changePassword({
        old_password: this.pwForm.old_password,
        new_password: this.pwForm.new_password,
      })
      .subscribe({
        next: () => {
          this.pwSuccess = 'Mot de passe modifié !';
          this.pwLoading = false;
          this.pwForm = { old_password: '', new_password: '', confirm: '' };
          this.cdr.detectChanges();
        },
        error: () => {
          this.pwError = 'Ancien mot de passe incorrect.';
          this.pwLoading = false;
          this.cdr.detectChanges();
        },
      });
  }

  logout() {
    this.auth.logout();
  }
}
