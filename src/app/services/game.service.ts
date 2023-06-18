import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {API_URL} from "./config";
import {GameCreate, Message} from "../models/game.model";
import {ResponseAPI} from "../models/responseAPI.model";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(private http: HttpClient) {
  }

  gameUrl: string = `${API_URL}/game`;

  public createGame(game: GameCreate) {
    return this.http.post<ResponseAPI>(this.gameUrl + "/create", game);
  }

  public deleteGame(gameId: string): Observable<ResponseAPI> {
    return this.http.delete<ResponseAPI>(this.gameUrl + "/" + gameId);
  }

  public updateGame(gameId: string, game: GameCreate): Observable<ResponseAPI> {
    console.log(gameId);
    return this.http.put<ResponseAPI>(this.gameUrl + "/" + gameId, game);
  }

  public getGameInformation(gameId: string | null): Observable<ResponseAPI> {
    return this.http.get<ResponseAPI>(this.gameUrl + "/" + gameId);
  }

  public startGame(gameId: string | null): Observable<ResponseAPI> {
    return this.http.get<ResponseAPI>(this.gameUrl + "/" + gameId + "/start")
  }

  public sendMessage(gameId: string, message: Message): Observable<ResponseAPI> {
    return this.http.post<ResponseAPI>(this.gameUrl + "/" + gameId + "/message", message);
  }

  public getStatusText(status: number): string {
    switch (status) {
      case 0:
        return 'non commencé';
      case 1:
        return 'en cours';
      case 2:
        return 'terminé';
      default:
        return 'unknown';
    }
  }
}
