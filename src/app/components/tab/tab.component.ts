import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss'],
})
export class TabComponent implements OnInit {
  private router: Router;

  constructor(router: Router) {
    this.router = router;
  }

  ngOnInit(): void {}

  public async onClickTab(index: number): Promise<void> {
    const pages: string[] = ['home', 'trip-list', 'user-profile'];
    this.router.navigate([pages[index]]);
  }

  public isActivate(index: number): boolean {
    const router: string = this.router.url.split('/')[1].split('?')[0];
    switch (index) {
      case 0: {
        return router === 'home';
      }
      case 1: {
        return (
          router === 'trip-list' ||
          router === 'trip-detail' ||
          router === 'add-trip'
        );
      }
      case 2: {
        return router === 'user-profile' || router === 'login';
      }
      default:
        return false;
    }
  }
}
