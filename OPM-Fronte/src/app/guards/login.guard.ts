import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(private router: Router) { }
  canActivate(): boolean {
    if (!!sessionStorage.getItem('accessToken') && !!sessionStorage.getItem('refreshToken')) {
      this.router.navigate(['/home']);
      return false;
    }
    return true;
  }
}
