import {Component, OnInit} from '@angular/core';
import {GameService} from "../../../services/game.service";
import {AlertService} from "../../../services/alert.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Message} from "../../../models/game.model";

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

  messageGameForm = {title: '', body: ''};
  gameId!: string;

  constructor(private gameService: GameService,
              private alertService: AlertService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.gameId = params.get('gameId') as string;
    });
  }

  onSubmit() {
    const gameMessage = this.messageGameForm as Message;
    this.gameService.sendMessage(this.gameId, gameMessage).subscribe({
      next: (res) => {
        this.alertService.success(res.message);
        this.router.navigate(['dashboard']);
      },
      error: err => this.alertService.error(err.error.message)
    });
  }

}
