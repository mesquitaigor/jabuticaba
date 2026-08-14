import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import AuthService from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const urlLogin = authService.URL_LOGIN.replace('/', '');
  if (route.url.some((segment) => segment.path === urlLogin) && authService.isAuthenticated()) {
    router.navigate([authService.URL_ENTRY_POINT]);
    return false;
  }else if(route.url.some((segment) => segment.path !== urlLogin) && !authService.isAuthenticated()){
    router.navigate([authService.URL_LOGIN]);
    return false;
  }else{
    return true;
  }
};
