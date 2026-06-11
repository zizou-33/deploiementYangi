import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const customerGuard: CanActivateFn = () => {
  const router = inject(Router);
  const user = localStorage.getItem('user');
  if (user) {
    const parsed = JSON.parse(user);
    if (parsed.role === 'customer' || parsed.role === 'admin') return true;
  }
  router.navigate(['/login']);
  return false;
};
