import {Component, OnInit} from '@angular/core';
import {GameDetailed, GamePlayer, KillAdmin, KillPlayer, Message} from "../../../models/game.model";
import {GameService} from "../../../services/game.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AlertService} from "../../../services/alert.service";
import {FinishContract} from "../../../models/contract";

@Component({
  selector: 'app-game-details',
  templateUrl: './game-details.component.html',
  styleUrls: ['./game-details.component.scss']
})
export class GameDetailsComponent implements OnInit {


  gameDetail!: GameDetailed;
  listMessage: Message[] = [];
  listPlayers: GamePlayer[] = [];

  selectedPlayer?: GamePlayer | null;

  FinishContractForm = {player_id: -1, weapon_id: -1};

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

  public killAdmin(userId: number) {
    const killAdmin: KillAdmin = {
      participant_id: userId,
    };
    this.gameService.killAdmin(this.gameId, killAdmin).subscribe({
      next: (res) => {
        this.alertService.success(res.message);
        this.ngOnInit();

      },
      error: err => this.alertService.error(err.error.message)
    });
  }

  public killPlayer(private_key: string) {
    const killPlayer: KillPlayer = {
      kill_key: private_key,
    }
    this.gameService.killPlayer(this.gameId, killPlayer).subscribe({
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

  onSubmitFinishContract() {
    this.FinishContractForm.player_id = this.selectedPlayer!.id;
    const finishContract = this.FinishContractForm as FinishContract;
    this.selectedPlayer = null;
    if (this.FinishContractForm.weapon_id === -1 || this.FinishContractForm.player_id === -1) {
      this.alertService.error("Vous n'avez pas sélectionné d'arme ou de joueur");
      return;
    }
    this.gameService.completeContract(this.gameId, finishContract).subscribe({
      next: (res) => {
        this.alertService.success(res.message);
        this.FinishContractForm = {player_id: -1, weapon_id: -1};
        this.ngOnInit();
      },
      error: err => this.alertService.error(err.error.message)
    });
  }


}
