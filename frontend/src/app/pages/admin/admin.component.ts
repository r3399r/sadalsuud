import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, Params } from '@angular/router';
import { PAGES } from 'src/app/constants/pages';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  selectedIndex: number | undefined;

  constructor(private activatedRoute: ActivatedRoute, private location: Location) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.selectedIndex = params['tab'];
    });
  }

  tabChanged(e: MatTabChangeEvent) {
    this.location.replaceState(`${PAGES.ADMIN}?tab=${e.index}`);
  }
}
