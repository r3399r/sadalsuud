import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { StarService } from 'src/app/services/star.service';

@Component({
  selector: 'app-stars',
  templateUrl: './stars.component.html',
  styleUrls: ['./stars.component.scss'],
})
export class StarsComponent implements OnInit {
  star: any;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private starService: StarService,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id');
      this.starService
        .getStar(id ?? 'xxx')
        .then((res: any) => {
          this.star = res;
        })
        .catch(() => {
          this.router.navigate(['/']);
        });
    });
  }
}
