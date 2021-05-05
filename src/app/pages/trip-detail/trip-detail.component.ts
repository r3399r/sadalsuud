import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { LineAuthService } from 'src/app/services/line-auth.service';
import { LineService } from 'src/app/services/line.service';
import { TripService } from 'src/app/services/trip.service';
import { UserService } from 'src/app/services/user.service';
import { DateHelper } from 'src/app/util/date-helper';

@Component({
  selector: 'app-trip-detail',
  templateUrl: './trip-detail.component.html',
  styleUrls: ['./trip-detail.component.scss'],
})
export class TripDetailComponent implements OnInit {
  private activatedRoute: ActivatedRoute;
  private lineAuthService: LineAuthService;
  private lineService: LineService;
  private userService: UserService;
  private tripService: TripService;
  private alertController: AlertController;
  private loadingController: LoadingController;
  private dateHelper: DateHelper;

  public isLogin: boolean;
  public isExpired: boolean;
  public trip: any;

  constructor(
    activatedRoute: ActivatedRoute,
    lineAuthService: LineAuthService,
    lineService: LineService,
    userService: UserService,
    tripService: TripService,
    alertController: AlertController,
    loadingController: LoadingController
  ) {
    this.activatedRoute = activatedRoute;
    this.lineAuthService = lineAuthService;
    this.lineService = lineService;
    this.userService = userService;
    this.tripService = tripService;
    this.alertController = alertController;
    this.loadingController = loadingController;
    this.dateHelper = new DateHelper();
  }

  async ngOnInit(): Promise<void> {
    const loading: HTMLIonLoadingElement = await this.loadingController.create({
      message: '讀取中...',
    });
    await loading.present();

    this.isLogin = await this.lineAuthService.isAuth();

    this.activatedRoute.params.subscribe(async (params: Params) => {
      const res = await this.tripService.getTrip(params.id);
      this.trip = {
        ...res,
        startDate: this.dateHelper.dateAll(res.startDate),
        endDate: this.dateHelper.dateAll(res.endDate),
        expiredDate: this.dateHelper.dateAll(res.expiredDate),
      };

      this.isExpired =
        new Date(this.trip.expiredDate).getTime() > Date.now() ? true : false;
      await loading.dismiss();
    });
  }

  public isPageLoading(): boolean {
    return this.trip === undefined || this.isLogin === undefined;
  }

  private async signConfirm(): Promise<void> {
    let response: string;
    let star: any;

    let loading: HTMLIonLoadingElement = await this.loadingController.create({
      message: '請稍等...',
    });
    await loading.present();

    const user = await this.userService.getUser();

    if (user === undefined) {
      const lineUserProfile = await this.userService.getLineUser();
      await this.lineService.pushMessage(lineUserProfile.userId, [
        '您好，我們收到您的報名申請，但由於我們的資料庫中並未有您的資料，故報名尚未成功。',
        '請您回覆以下基本資訊，謝謝您\n1. 姓名\n2. 身份(星兒家人或星雨團員或其他)\n3. 聯絡方式(手機)',
      ]);

      response =
        '報名尚未成功。資料庫並未有您的資料，請開啟LINE回覆星遊的官方帳號';
    } else if (user.role !== 'family' && user.role !== 'star')
      response =
        '報名失敗。此活動僅開放給星兒或家人報名，資料庫顯示您的身份為「星雨哥姐」。若您想參加活動或資料設定有誤，請洽星遊的LINE官方帳號，謝謝';
    else if (user.starInfo.length === 0)
      response = '報名失敗。資料庫資料設定有誤，請洽星遊的LINE官方帳號，謝謝';
    else {
      if (user.starInfo.length === 1) star = user.starInfo[0];
      else {
        const selectStar: HTMLIonAlertElement = await this.alertController.create(
          {
            header: '請選擇欲報名參加者',
            inputs: user.starInfo.map((val: any) => ({
              type: 'radio',
              label: val.name,
              value: val,
            })),
            buttons: [
              {
                text: '確認',
                role: 'confirm',
              },
              '取消',
            ],
          }
        );
        await loading.dismiss();
        await selectStar.present();

        const eventSelectStar = await selectStar.onDidDismiss();

        if (eventSelectStar.role !== 'confirm') return;
        star = eventSelectStar.data.values;

        loading = await this.loadingController.create({
          message: '請稍等...',
        });
        await loading.present();
      }

      response = await this.tripService.signTrip(this.trip.creationId, star);
    }

    await loading.dismiss();
    const alert: HTMLIonAlertElement = await this.alertController.create({
      message: response,
      buttons: ['知道了'],
    });
    await alert.present();
  }

  public async onSign(): Promise<void> {
    const alert: HTMLIonAlertElement = await this.alertController.create({
      message: '請確認是否報名此次出遊',
      buttons: [
        {
          text: '是的',
          role: 'confirm',
        },
        '取消',
      ],
    });
    await alert.present();

    const eventDetail = await alert.onDidDismiss();
    if (eventDetail.role === 'confirm') await this.signConfirm();
  }

  public getAccompanyText(needFamilyAccompany: string): string {
    if (needFamilyAccompany === 'yes') return '是';

    return '視情況而定';
  }

  public warningMessage(): string {
    if (!this.isLogin) return '您尚未登入，可點擊右下角的「個人資料」以登入';
    if (!this.isExpired) return '報名期限已過，此活動僅開放查詢';

    return;
  }
}
