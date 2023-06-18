import { Component, OnInit } from '@angular/core';
import {PersonalInformation} from "../../../models/user.model";
import {AuthService} from "../../../services/auth.service";
import {GameService} from "../../../services/game.service";
import {AlertService} from "../../../services/alert.service";
import {UserService} from "../../../services/user.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  userInfos! :  PersonalInformation;
  subPage! : string;

  constructor(private userService: UserService,
              private gameService: GameService,
              private alertService: AlertService) { }

  ngOnInit(): void {
    this.getUserInformations();
    this.subPage = 'games';
  }

  getUserInformations(){
    this.userService.getUserGameInformations().subscribe(res =>{
      this.userInfos = res.data as PersonalInformation;
    });
  }

  getStatusText(status: number): string {
    return this.gameService.getStatusText(status);
  }
  startGame(idGame: string) {
    this.gameService.startGame(idGame).subscribe({
      next: (res) => {
        this.alertService.success(res.message);
        this.getUserInformations();
      },
      error: err => this.alertService.error(err.error.message)
    })
  }

  deleteGame(idGame: string) {
    this.gameService.deleteGame(idGame).subscribe({
      next: (res) => {
        this.alertService.success(res.message);
        this.getUserInformations();
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth'
        });
      },
      error: err => this.alertService.error(err.error.message)
    });
  }

  setSubPage(choice: string) {
    this.subPage = choice;
  }
}
