import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ERROR } from 'src/app/locales/errors';
import { LoginUrlParams } from 'src/app/model/Line';
import { LoginService } from 'src/app/services/login.service';
import { VariablesService } from 'src/app/services/variables.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  private clientId: string | undefined;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private loginService: LoginService,
    private variablesService: VariablesService,
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params: LoginUrlParams) => {
      if (Object.entries(params).length > 0) this.loginProcess(params);
      else {
        this.variablesService.getVariables('lineLoginId').then((variables) => {
          this.clientId = variables.lineLoginId;
          this.isLoading = false;
        });
      }
    });
  }

  onLoginClick() {
    window.location.href = this.loginService.getLineLoginUrl(String(this.clientId));
  }

  loginProcess(params: LoginUrlParams) {
    this.isLoading = true;
    this.loginService
      .login(params)
      .then(() => {
        this.router.navigate(['user']);
      })
      .catch(() => {
        this.snackBar.open(ERROR.WRONG_LOGIN_STATE, undefined, { duration: 4000 });
        this.isLoading = false;
      });
  }
}
