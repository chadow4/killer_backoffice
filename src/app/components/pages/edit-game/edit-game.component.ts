import { Component, OnInit } from '@angular/core';
import {GameService} from "../../../services/game.service";
import {AlertService} from "../../../services/alert.service";
import {ActivatedRoute, Router} from "@angular/router";
import {GameCreate} from "../../../models/game.model";

@Component({
  selector: 'app-edit-game',
  templateUrl: './edit-game.component.html',
  styleUrls: ['./edit-game.component.scss']
})
export class EditGameComponent implements OnInit {

  editGameForm = {name : ''};
  gameName!: string;
  gameId!: string;

  constructor(private gameService: GameService,
              private alertService: AlertService,
              private router : Router,
              private route : ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.gameName = params.get('gameName') as string;
      this.gameId = params.get('gameId') as string;
    });
    this.editGameForm.name = this.gameName;
  }

  onSubmit(){
    const gameEdit = this.editGameForm as GameCreate;
    this.gameService.updateGame(this.gameId,gameEdit).subscribe({
      next: (res) => {
        this.alertService.success(res.message);
        this.router.navigate(['dashboard']);
      },
      error: err => this.alertService.error(err.error.message)
    });
  }

}
