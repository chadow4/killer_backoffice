import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import {AuthService} from "../services/auth.service";
import {AlertService} from "../services/alert.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private refreshingToken: boolean = false;

  constructor(private authService: AuthService, private router: Router, private alertService : AlertService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    const token = this.authService.getCurrentToken()?.token || null;
    const refreshToken = this.authService.getCurrentRefreshToken() || null;
    if (token) {
      const tokenExpiration = this.authService.getJwtContentToken().exp;
      const date = new Date(tokenExpiration * 1000);
      console.log(date.toLocaleTimeString());
      if (isTokenExpired(tokenExpiration) && !this.refreshingToken) {
        this.refreshingToken = true;
        this.authService.refreshToken(refreshToken).subscribe(
          (response) => {
            const jwtToken = {
              token: response.data.token,
            };
            this.authService.setCurrentTokens(jwtToken, refreshToken);
            this.alertService.success("Your session has been renewed");
            this.refreshingToken = false; // Réinitialiser la variable après le rafraîchissement du jeton
          },
          (refreshError) => {
            this.authService.logout();
            this.router.navigateByUrl(`login`).then(() =>
              this.alertService.error("You are now disconnected, invalid token")
            );
            this.refreshingToken = false; // Réinitialiser la variable en cas d'échec du rafraîchissement du jeton
          }
        );
      }
      const newToken = this.authService.getCurrentToken()?.token || null;
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${newToken}`,
        },
      });
    }

    function isTokenExpired(expiration: number): boolean {
      const currentTime = Math.floor(Date.now() / 1000);
      return expiration < currentTime;
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(error);
      })
    );
  }


}
