import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {API_URL} from "./config";
import {ResponseAPI} from "../models/responseAPI.model";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  userUrl:string = `${API_URL}/user`;
  constructor(private http: HttpClient) { }

  public getUserGameInformations(): Observable<ResponseAPI> {
    return this.http.get<ResponseAPI>(this.userUrl + "/me");
  }
}
