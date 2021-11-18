import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { ERROR } from 'src/app/locales/errors';
import { LoginUrlParams } from 'src/app/model/Line';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  private authhorizationUrl = 'https://access.line.me/oauth2/v2.1/authorize';
  private responseType = 'code';
  private clientId = 'xxxxxx';
  private redirectUri = `${window.location.origin}/login`;
  private state = Date.now().toString();
  private scope = 'profile';
  private botPrompt = 'normal';

  constructor(private route: ActivatedRoute, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: LoginUrlParams) => {
      if (Object.entries(params).length > 0) this.loginProcess(params);
    });
  }

  onLoginClick() {
    sessionStorage.setItem('state', this.state);
    const url = `${this.authhorizationUrl}?${new URLSearchParams({
      response_type: this.responseType,
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      state: this.state,
      scope: this.scope,
      bot_prompt: this.botPrompt,
    })}`;

    window.location.href = url;
  }

  loginProcess(params: LoginUrlParams) {
    const state = sessionStorage.getItem('state');
    if (params.state !== state)
      this.snackBar.open(ERROR.WRONG_LOGIN_STATE, undefined, { duration: 4000 });

    sessionStorage.removeItem('state');
  }
}
