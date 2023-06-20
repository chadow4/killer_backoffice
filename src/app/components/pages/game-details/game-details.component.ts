import {Component, OnInit} from '@angular/core';
import {GameDetailed, GamePlayer, KillAdmin, Message} from "../../../models/game.model";
import {GameService} from "../../../services/game.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AlertService} from "../../../services/alert.service";

@Component({
  selector: 'app-game-details',
  templateUrl: './game-details.component.html',
  styleUrls: ['./game-details.component.scss']
})
export class GameDetailsComponent implements OnInit {


  gameDetail!: GameDetailed;
  listMessage: Message[] = [];
  listPlayers: GamePlayer[] = [];

  isFullyLoaded: boolean = false;
  offset: number = 0;
  limit: number = 20;
  gameId!: string;

  constructor(
    private gameService: GameService,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.offset = 0;
    this.route.paramMap.subscribe(params => {
      this.gameId = params.get('gameId')!;
    });

    this.loadGameInformations();
    this.loadMessages();
    this.loadGamePlayers();
  }

  public getStatusText(status: number): string {
    return this.gameService.getStatusText(status);
  }

  private loadGameInformations() {
    this.gameService.getGameInformation(this.gameId).subscribe((res) => {
      this.gameDetail = res.data as GameDetailed
    });
  }

  private loadGamePlayers() {
    this.gameService.getGamePlayers(this.gameId).subscribe((res) => {
      this.listPlayers = res.data.players as GamePlayer[];
    });
  }

  private loadMessages() {
    this.gameService.getMessages(this.gameId, this.offset, this.limit).subscribe((res) => {
      if (res.data.messages.length < this.limit) {
        this.isFullyLoaded = true;
      }
      if (this.offset === 0) {
        this.listMessage = res.data.messages as Message[];
      } else {
        this.listMessage.push(...res.data.messages as Message[]);
      }
    });
  }

  public loadMore() {
    this.offset++;
    this.loadMessages();
  }


  deleteGame(idGame: string) {
    this.gameService.deleteGame(idGame).subscribe({
      next: (res) => {
        this.router.navigate(['/dashboard']).then(() => this.alertService.success(res.message));
      },
      error: err => this.alertService.error(err.error.message)
    });
  }

  startGame(idGame: string) {
    this.gameService.startGame(idGame).subscribe({
      next: (res) => {
        this.alertService.success(res.message);
        this.ngOnInit();
      },
      error: err => this.alertService.error(err.error.message)
    });
  }

  public killAdmin(gameId: string, userId: number) {
    const killAdmin: KillAdmin = {
      participant_id: userId,
    };
    this.gameService.killAdmin(gameId, killAdmin).subscribe({
      next: (res) => {
        this.alertService.success(res.message);
        this.ngOnInit();

      },
      error: err => this.alertService.error(err.error.message)
    });
  }

  onScroll(event: any): void {
    const element = event.target;
    const atBottom = element.scrollHeight - element.scrollTop === element.clientHeight;
    if (atBottom) {
      this.loadMore();
      if (!this.isFullyLoaded) {
        this.alertService.success("Chargement de plus de messages ...");
      } else {
        this.alertService.error("Plus de messages à charger");
      }
    }
  }

}
