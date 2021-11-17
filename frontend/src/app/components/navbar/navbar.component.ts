import { Component, Input, OnInit } from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { MatDrawerToggleResult, MatSidenav } from '@angular/material/sidenav';
import { MEDIA } from 'src/app/constants/media';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  private breakpointObserver: BreakpointObserver;
  public isBiggerThanMd: boolean = false;
  @Input() sideNav!: MatSidenav;

  constructor(breakpointObserver: BreakpointObserver) {
    this.breakpointObserver = breakpointObserver;
  }

  ngOnInit(): void {
    this.breakpointObserver.observe([MEDIA.MD]).subscribe((result: BreakpointState) => {
      this.isBiggerThanMd = result.matches;
    });
  }
}
