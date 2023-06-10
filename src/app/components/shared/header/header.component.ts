import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../../services/auth.service";
import {AlertService} from "../../../services/alert.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  loggedIn!: boolean;
  constructor(private authService: AuthService,
              private router: Router,
              private alertService: AlertService) { }

  ngOnInit(): void {
    this.authService.authStateChanged.subscribe((loggedIn: boolean) => {
      this.loggedIn = this.authService.isLoggedIn();
    });
  }

  public logout(){
    this.authService.logout();
  }

}
