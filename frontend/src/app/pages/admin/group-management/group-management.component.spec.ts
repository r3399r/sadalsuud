import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReactiveFormsModule } from '@angular/forms';
import { GroupManagementComponent } from './group-management.component';
import { GroupService } from 'src/app/services/group.service';
import { StarService } from 'src/app/services/star.service';

describe('GroupManagementComponent', () => {
  let component: GroupManagementComponent;
  let fixture: ComponentFixture<GroupManagementComponent>;
  let groupServiceSpy: jasmine.SpyObj<GroupService>;
  let starServiceSpy: jasmine.SpyObj<StarService>;
  let matSnackBarSpy: jasmine.SpyObj<MatSnackBar>;
  let dummyGroup: any;

  beforeAll(() => {
    dummyGroup = [
      { id: 'g1', user: [{ id: 'user1' }] },
      { id: 'g2', user: [{ id: 'user2' }], star: { id: 'star1' } },
    ];
  });

  beforeEach(async () => {
    groupServiceSpy = jasmine.createSpyObj('GroupService', [
      'getAllGroups',
      'addGroup',
      'addGroupMember',
      'removeGroupMember',
      'refreshAllGroups',
    ]);
    starServiceSpy = jasmine.createSpyObj('StarService', ['getAllStars']);
    matSnackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    groupServiceSpy.getAllGroups.and.resolveTo(dummyGroup);
    groupServiceSpy.refreshAllGroups.and.resolveTo(dummyGroup);
    groupServiceSpy.addGroupMember.and.resolveTo();
    groupServiceSpy.removeGroupMember.and.resolveTo();
    starServiceSpy.getAllStars.and.resolveTo();

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [GroupManagementComponent],
      providers: [
        { provide: GroupService, useValue: groupServiceSpy },
        { provide: StarService, useValue: starServiceSpy },
        { provide: MatSnackBar, useValue: matSnackBarSpy },
      ],
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

  it('onRefresh should work', () => {
    component.onRefresh();
    fixture.whenStable().then(() => {
      expect(groupServiceSpy.getAllGroups).toHaveBeenCalledTimes(1);
    });
  });

  it('onInput should work', () => {
    component.onInput({ target: { value: 'a' } }, 'id');
    expect(component.inputUser.get('id')).toBe('a');
  });

  it('onAdd should work', () => {
    component.inputUser.set('id', 'a');
    component.onAdd('id');
    fixture.whenStable().then(() => {
      expect(groupServiceSpy.addGroupMember).toHaveBeenCalledTimes(1);
    });
  });

  it('onAdd should return if inputUser is empty', () => {
    component.onAdd('id');
    fixture.whenStable().then(() => {
      expect(groupServiceSpy.addGroupMember).toHaveBeenCalledTimes(0);
    });
  });

  it('onAdd should fail if api fail', () => {
    groupServiceSpy.addGroupMember.and.rejectWith();
    component.inputUser.set('id', 'a');
    component.onAdd('id');
    fixture.whenStable().then(() => {
      expect(matSnackBarSpy.open).toHaveBeenCalledTimes(1);
    });
  });

  it('onDelete should work', () => {
    component.onDelete('groupId', 'userId');
    fixture.whenStable().then(() => {
      expect(groupServiceSpy.removeGroupMember).toHaveBeenCalledTimes(1);
    });
  });

  it('onDelete should fail if api fail', () => {
    groupServiceSpy.removeGroupMember.and.rejectWith();
    component.onDelete('groupId', 'userId');
    fixture.whenStable().then(() => {
      expect(matSnackBarSpy.open).toHaveBeenCalledTimes(1);
    });
  });
});
