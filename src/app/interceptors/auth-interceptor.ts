import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import {AuthService} from "../services/auth.service";
import {AlertService} from "../services/alert.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router, private alertService : AlertService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    const token = this.authService.getCurrentToken()?.token || null;
    const refreshToken = this.authService.getCurrentRefreshToken() || null;


    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 403) {
          this.authService.refreshToken(refreshToken).subscribe(
            (response) => {
              const jwtToken = {
                token: response.data.token,
              };
              this.authService.setCurrentTokens(jwtToken, refreshToken);
              console.log("token refreshed");
            },
            (refreshError) => {
              this.authService.logout();
              this.router.navigateByUrl(`login`).then(() => this.alertService.error("You are now disconnected, token expired"));
            }
          );
        }

        return throwError(error);
      })
    );
  }
}
