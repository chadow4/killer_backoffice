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


}
