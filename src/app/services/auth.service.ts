import {Injectable} from '@angular/core';
import {API_URL} from "./config";
import {BehaviorSubject, Observable, tap} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {AlertService} from "./alert.service";
import {Router} from "@angular/router";
import {JwtToken, JwtTokenContent, Login, RefreshToken, Register} from "../models/auth.model";
import {ResponseAPI} from "../models/responseAPI.model";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);

  authStateChanged = this.isLoggedInSubject.asObservable();
  USER_TOKEN_KEY = 'user_token_key';
  USER_REFRESH_TOKEN_KEY = 'user_refresh_token_key';

  authUrl: string = `${API_URL}/auth`;

  constructor(private http: HttpClient, private alertService: AlertService, private router: Router) {
  }

  public register(register: Register): Observable<ResponseAPI> {
    return this.http.post<ResponseAPI>(this.authUrl + "/register", register);
  }

  public login(login: Login): Observable<ResponseAPI> {
    return this.http.post<ResponseAPI>(this.authUrl + "/login", login).pipe(
      tap((response: ResponseAPI) => {
        const jwtToken: JwtToken = {
          token: response.data.token,
        }
        const refreshToken: RefreshToken = {
          refresh_token: response.data.refresh_token
        }
        this.setCurrentTokens(jwtToken, refreshToken);
        this.isLoggedInSubject.next(true);
      })
    );
  }

  public logout() {
    localStorage.removeItem(this.USER_TOKEN_KEY);
    localStorage.removeItem(this.USER_REFRESH_TOKEN_KEY);
    this.isLoggedInSubject.next(false);
    this.router.navigate(['/']);
  }

  public isLoggedIn(): boolean {
    return this.getCurrentToken() != null;
  }

  public getCurrentToken(): JwtToken | null {
    const userJwtToken = window.localStorage.getItem(this.USER_TOKEN_KEY);
    return userJwtToken ? JSON.parse(userJwtToken) : null;
  }

  public getCurrentRefreshToken(): RefreshToken | null {
    const userRefreshToken = window.localStorage.getItem(this.USER_REFRESH_TOKEN_KEY);
    return userRefreshToken ? JSON.parse(userRefreshToken) : null;
  }

  public setCurrentTokens(token: JwtToken | null, refreshToken: RefreshToken | null) {
    window.localStorage.setItem(this.USER_TOKEN_KEY, JSON.stringify(token));
    window.localStorage.setItem(this.USER_REFRESH_TOKEN_KEY, JSON.stringify(refreshToken));
  }

  public refreshToken(refreshToken: RefreshToken | null): Observable<ResponseAPI> {
    return this.http.post<ResponseAPI>(this.authUrl + "/refresh", refreshToken).pipe(
      tap((response: ResponseAPI) => {
          const jwtToken: JwtToken = {
            token: response.data.token,
          }
          this.setCurrentTokens(jwtToken, refreshToken);
        }
      ));
  }

  public getJwtContentToken(): JwtTokenContent {
    const userJwtToken = this.getCurrentToken()!.token;
    return userJwtToken ? JSON.parse(atob(userJwtToken.split('.')[1])) : null;
  }
}
