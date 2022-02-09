import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StarManagementComponent } from './star-management.component';

describe('StarManagementComponent', () => {
  let component: StarManagementComponent;
  let fixture: ComponentFixture<StarManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StarManagementComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StarManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
