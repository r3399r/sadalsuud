import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';
import { UserFormComponent } from './user-form.component';

describe('UserFormComponent', () => {
  let component: UserFormComponent;
  let fixture: ComponentFixture<UserFormComponent>;
  let matDialogSpy: jasmine.SpyObj<MatDialog>;
  let expectInput: any;

  beforeEach(async () => {
    matDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    matDialogSpy.open.and.returnValue({ afterClosed: () => of(true) } as MatDialogRef<
      typeof component
    >);

    await TestBed.configureTestingModule({
      declarations: [UserFormComponent],
      providers: [{ provide: MatDialog, useValue: matDialogSpy }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserFormComponent);
    component = fixture.componentInstance;

    expectInput = { name: 'a', phone: '0912345678', birthday: '2021/01/01' };
    component.user = expectInput;

    fixture.detectChanges();

    spyOn(component.formSubmit, 'emit');
    spyOn(component.updateCancel, 'emit');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit formSubmit', () => {
    component.onSubmit();

    expect(component.formSubmit.emit).toHaveBeenCalledTimes(1);
  });

  it('should emit updateCancel', () => {
    const button = fixture.debugElement.nativeElement.querySelector('#btn-cancel');
    button.click();

    expect(component.updateCancel.emit).toHaveBeenCalledTimes(1);
  });
});
