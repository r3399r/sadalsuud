import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StarsComponent } from './stars.component';
import { StarService } from 'src/app/services/star.service';

describe('StarsComponent', () => {
  let component: StarsComponent;
  let fixture: ComponentFixture<StarsComponent>;
  let starServiceSpy: jasmine.SpyObj<StarService>;

  beforeEach(async () => {
    starServiceSpy = jasmine.createSpyObj('StarService', ['getStar']);

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [StarsComponent],
      providers: [{ provide: StarService, useValue: starServiceSpy }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
