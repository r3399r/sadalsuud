import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { LineAuthService } from 'src/app/services/line-auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public lineLoginUrl: string;
  private lineAuthService: LineAuthService;
  private loadingController: LoadingController;

  constructor(
    lineAuthService: LineAuthService,
    loadingController: LoadingController
  ) {
    this.lineAuthService = lineAuthService;
    this.loadingController = loadingController;
  }

  async ngOnInit(): Promise<void> {
    const loading: HTMLIonLoadingElement = await this.loadingController.create({
      message: '讀取中...',
    });
    await loading.present();

    this.lineLoginUrl = await this.lineAuthService.getLink();
    await loading.dismiss();
  }
}
