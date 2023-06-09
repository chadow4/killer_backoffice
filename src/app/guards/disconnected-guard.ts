import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthService} from "../services/auth.service";
import {AlertService} from "../services/alert.service";

@Injectable({providedIn: 'root'})

export class DisconnectedGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService, private alertService: AlertService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const isLoggedIn = this.authService.isLoggedIn();
    if (!isLoggedIn) {
      this.router.navigate(['login']).then(() => this.alertService.error("You must be logged in to access this page"));
      return false;
    }
    return true;
  }
}
