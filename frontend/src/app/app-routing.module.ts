import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PAGES } from './constants/pages';
import { AdminGuard } from './guard/admin.guard';
import { AuthGuard } from './guard/auth.guard';
import { AdminComponent } from './pages/admin/admin.component';
import { LandingComponent } from './pages/landing/landing.component';
import { LoginComponent } from './pages/login/login.component';
import { QuestionsComponent } from './pages/questions/questions.component';
import { TripDetailComponent } from './pages/trips/trip-detail/trip-detail.component';
import { TripEditorComponent } from './pages/trips/trip-editor/trip-editor.component';
import { TripListComponent } from './pages/trips/trip-list/trip-list.component';
import { UserComponent } from './pages/user/user.component';

const routes: Routes = [
  { path: PAGES.TRIPS, component: TripListComponent },
  { path: `${PAGES.TRIPS}/editor`, component: TripEditorComponent },
  { path: `${PAGES.TRIPS}/:id`, component: TripDetailComponent },
  { path: PAGES.QUESTIONS, component: QuestionsComponent },
  { path: PAGES.USER, component: UserComponent, canActivate: [AuthGuard] },
  { path: PAGES.LOGIN, component: LoginComponent },
  { path: PAGES.ADMIN, component: AdminComponent, canActivate: [AdminGuard] },
  { path: '', component: LandingComponent },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
