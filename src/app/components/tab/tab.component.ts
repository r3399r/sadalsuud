import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss'],
})
export class TabComponent implements OnInit {
  private router: Router;
  private routes: string[][] = [
    ['home'],
    ['trip-list', 'trip-detail'],
    ['user-profile', 'login', 'register'],
  ];

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

    return this.routes[index].includes(router);
  }
}
