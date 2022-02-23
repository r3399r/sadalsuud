import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GroupManagementComponent } from './group-management.component';
import { GroupService } from 'src/app/services/group.service';

describe('GroupManagementComponent', () => {
  let component: GroupManagementComponent;
  let fixture: ComponentFixture<GroupManagementComponent>;
  let groupServiceSpy: jasmine.SpyObj<GroupService>;
  let dummyGroup: any;

  beforeAll(() => {
    dummyGroup = [
      { id: 'g1', user: [{ id: 'user1' }] },
      { id: 'g2', user: [{ id: 'user2' }], star: { id: 'star1' } },
    ];
  });

  beforeEach(async () => {
    groupServiceSpy = jasmine.createSpyObj('GroupService', ['getAllGroups']);
    groupServiceSpy.getAllGroups.and.resolveTo(dummyGroup);

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
});
