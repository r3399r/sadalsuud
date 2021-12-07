import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginUrlParams } from 'src/app/model/Line';
import { AuthService } from 'src/app/services/auth.service';
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
    private authService: AuthService,
    private variablesService: VariablesService,
  ) {}

  ngOnInit() {
    this.variablesService.getVariables('lineLoginId').then((variables) => {
      this.clientId = variables.lineLoginId;
      this.isLoading = false;
    });
    this.route.queryParams.subscribe((params: LoginUrlParams) => {
      if (Object.entries(params).length > 0) this.loginProcess(params);
    });
  }

  onLoginClick() {
    window.location.href = this.authService.getLineLoginUrl(String(this.clientId));
  }

  loginProcess(params: LoginUrlParams) {
    this.isLoading = true;
    this.authService
      .login(params)
      .then(() => {
        this.router.navigate(['user']);
      })
      .catch((e) => {
        this.snackBar.open(e.message, undefined, { duration: 4000 });
      })
      .finally(() => {
        this.isLoading = false;
      });
  }
}
