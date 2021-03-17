import { Component, OnInit } from '@angular/core';
import { LineAuthService } from 'src/app/services/line-auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public lineLoginUrl: string;
  private lineAuthService: LineAuthService;

  constructor(lineAuthService: LineAuthService) {
    this.lineAuthService = lineAuthService;
  }

  async ngOnInit(): Promise<void> {
    this.lineLoginUrl = await this.lineAuthService.getLink();
  }
}
