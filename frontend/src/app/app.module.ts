import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { LayoutModule } from '@angular/cdk/layout';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MomentDateModule } from '@angular/material-moment-adapter';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { AppRoutingModule } from './app-routing.module';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AppComponent } from './app.component';
import { LandingComponent } from './pages/landing/landing.component';
import { QuestionsComponent } from './pages/questions/questions.component';
import { UserComponent } from './pages/user/user.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { LoginComponent } from './pages/login/login.component';
import { LoaderComponent } from './components/loader/loader.component';
import { UserFormComponent } from './pages/user/user-form/user-form.component';
import { MY_NATIVE_DATE_FORMATS } from './constants/dateFormats';
import { DialogComponent as UserDialogComponent } from './pages/user/dialog/dialog.component';
import { DialogComponent as TripDialogComponent } from './pages/trips/dialog/dialog.component';
import { TripListComponent } from './pages/trips/trip-list/trip-list.component';
import { TripDetailComponent } from './pages/trips/trip-detail/trip-detail.component';
import { TripEditorComponent } from './pages/trips/trip-editor/trip-editor.component';
import { AdminComponent } from './pages/admin/admin.component';
import { UserManagementComponent } from './pages/admin/user-management/user-management.component';
import { GroupManagementComponent } from './pages/admin/group-management/group-management.component';
import { TripManagementComponent } from './pages/admin/trip-management/trip-management.component';
import { StarManagementComponent } from './pages/admin/star-management/star-management.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LandingComponent,
    QuestionsComponent,
    UserComponent,
    SidenavComponent,
    LoginComponent,
    LoaderComponent,
    UserFormComponent,
    UserDialogComponent,
    TripDialogComponent,
    TripListComponent,
    TripDetailComponent,
    TripEditorComponent,
    AdminComponent,
    UserManagementComponent,
    GroupManagementComponent,
    TripManagementComponent,
    StarManagementComponent,
  ],
  imports: [
    MatSidenavModule,
    BrowserModule,
    LayoutModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatSnackBarModule,
    MatIconModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MomentDateModule,
    MatButtonModule,
    MatDialogModule,
    MatDividerModule,
    MatCheckboxModule,
    MatTabsModule,
    MatSelectModule,
    MatTableModule,
    MatSortModule,
    MatExpansionModule,
    ClipboardModule,
  ],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_NATIVE_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'zh-TW' },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
