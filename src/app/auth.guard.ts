import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);  // Inject AuthService using Angular's inject function
  const router = inject(Router);  // Inject Router for navigation

  if (authService.isAuthenticated()) {
    return true; // Allow access if authenticated
  } else {
    router.navigate(['/login']);  // Redirect to login if not authenticated
    return false;  // Block access
  }
};