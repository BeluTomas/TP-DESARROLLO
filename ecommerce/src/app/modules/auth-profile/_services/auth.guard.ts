import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    public authService:AuthService,
    public router: Router,
  ) {

  }

 canActivate(
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  if (!this.authService.user || !this.authService.token) {
    this.router.navigate(["auth/login"]);
    return false;
  }

  let token = this.authService.token;

  try {
    let payload = JSON.parse(atob(token.split('.')[1]));
    let expiration = payload.exp;

    if (Math.floor(new Date().getTime() / 1000) >= expiration) {
      this.authService.logout();
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error al parsear el token:', error);
    this.authService.logout();
    this.router.navigate(["auth/login"]);
    return false;
  }
}
}
