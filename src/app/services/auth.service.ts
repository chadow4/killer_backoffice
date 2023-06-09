import {Injectable} from '@angular/core';
import {API_URL} from "./config";
import {BehaviorSubject, Observable, tap} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {AlertService} from "./alert.service";
import {Router} from "@angular/router";
import {JwtToken, Login, Register} from "../models/auth.model";
import {ResponseAPI} from "../models/responseAPI.model";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);

  authStateChanged = this.isLoggedInSubject.asObservable();
  USER_TOKEN_KEY = 'user_token_key';

  userUrl: string = `${API_URL}/auth`;

  constructor(private http: HttpClient, private alertService: AlertService, private router: Router) {
  }

  public register(register: Register): Observable<ResponseAPI> {
    return this.http.post<ResponseAPI>(this.userUrl + "/register", register);
  }

  public login(login: Login): Observable<ResponseAPI> {
    return this.http.post<ResponseAPI>(this.userUrl + "/login", login).pipe(
      tap((response: ResponseAPI) => {
        const jwtToken: JwtToken = {
          token: response.data.token,
          refresh_token: response.data.refresh_token
        }
        this.setCurrentToken(jwtToken);
        this.isLoggedInSubject.next(true);
      })
    );
  }

  public logout() {
    localStorage.removeItem(this.USER_TOKEN_KEY);
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

  public setCurrentToken(token: JwtToken) {
    const userJwtTokenString = JSON.stringify(token);
    window.localStorage.setItem(this.USER_TOKEN_KEY, userJwtTokenString);
  }
}
