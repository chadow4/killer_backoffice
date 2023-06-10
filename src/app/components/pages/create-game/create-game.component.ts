import { Component, OnInit } from '@angular/core';
import {GameService} from "../../../services/game.service";
import {AlertService} from "../../../services/alert.service";
import {GameCreate} from "../../../models/game.model";
import {Router} from "@angular/router";

@Component({
  selector: 'app-create-game',
  templateUrl: './create-game.component.html',
  styleUrls: ['./create-game.component.scss']
})
export class CreateGameComponent implements OnInit {

  createGameForm = {name : ''};
  constructor(private gameService: GameService,
              private alertService: AlertService,
              private router : Router) { }

  ngOnInit(): void {
  }

  onSubmit(){
    const gameCreate = this.createGameForm as GameCreate;
    this.gameService.createGame(gameCreate).subscribe({
      next: (res) => {
        this.alertService.success(res.message);
        this.router.navigate(['dashboard']);
      },
      error: err => this.alertService.error(err.error.message)
    });
  }

}
