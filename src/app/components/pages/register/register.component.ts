import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../services/auth.service";
import {Router} from "@angular/router";
import {AlertService} from "../../../services/alert.service";
import {Register} from "../../../models/auth.model";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm = {username: '', email: '', password: ''};

  constructor(private authService: AuthService,
              private router: Router,
              private alertService: AlertService) {
  }

  ngOnInit(): void {
  }

  onSubmit() {
    const userRegister = this.registerForm as Register;
    this.authService.register(userRegister).subscribe({
      next: (data) => {
        this.router.navigate(['/login']).then(() => this.alertService.success(data.message));
      },
      error: err => this.alertService.error(err.error.message)
    });
  }

}
