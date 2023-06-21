import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../../services/auth.service";
import {Router} from "@angular/router";
import {AlertService} from "../../../services/alert.service";
import {Login} from "../../../models/auth.model";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm = {email : '', password : '', persistent_session : true};
  constructor(private authService : AuthService,
              private router: Router,
              private alertService: AlertService) { }

  ngOnInit(): void {
  }

  onSubmit(){
    const userLogin = this.loginForm as Login;
    this.authService.login(userLogin).subscribe({
      next: (data) => {
        this.router.navigate(['dashboard']);
      },
      error: err => this.alertService.error("erreur API")
    });
  }
}
