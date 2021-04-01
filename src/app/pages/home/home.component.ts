import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { LineAuthService } from 'src/app/services/line-auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  private activatedRoute: ActivatedRoute;
  private lineAuthService: LineAuthService;
  public toastController: ToastController;
  private router: Router;

  constructor(
    activatedRoute: ActivatedRoute,
    lineAuthService: LineAuthService,
    toastController: ToastController,
    router: Router
  ) {
    this.activatedRoute = activatedRoute;
    this.lineAuthService = lineAuthService;
    this.toastController = toastController;
    this.router = router;
  }

  public async ngOnInit(): Promise<void> {
    this.activatedRoute.queryParams.subscribe(
      async (params: Params): Promise<void> => {
        if (params.state === this.lineAuthService.getState()) {
          const result: boolean = await this.lineAuthService.login(params.code);

          const message: string = result ? '登入成功' : '登入失敗';

          const toast = await this.toastController.create({
            message,
            duration: 3000,
          });
          await toast.present();

          if (message === '登入成功')
            await this.router.navigate(['user-profile']);
        }
      }
    );
  }
}
