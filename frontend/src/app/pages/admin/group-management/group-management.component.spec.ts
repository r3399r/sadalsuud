import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Star } from '@y-celestial/sadalsuud-service';
import { GroupManagementComponent } from './group-management.component';
import { GroupService } from 'src/app/services/group.service';

describe('GroupManagementComponent', () => {
  let component: GroupManagementComponent;
  let fixture: ComponentFixture<GroupManagementComponent>;
  let groupServiceSpy: jasmine.SpyObj<GroupService>;

  beforeEach(async () => {
    groupServiceSpy = jasmine.createSpyObj('GroupService', ['getAllGroups']);
    groupServiceSpy.getAllGroups.and.resolveTo();

    await TestBed.configureTestingModule({
      declarations: [GroupManagementComponent],
      providers: [{ provide: GroupService, useValue: groupServiceSpy }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('getStar should work', () => {
    expect(component.getStar({ name: 'hi' } as Star)).toBe('hi');
    expect(component.getStar(undefined)).toBe('無');
  });
});
