import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PAGES } from './constants/pages';
import { LandingComponent } from './pages/landing/landing.component';
import { LoginComponent } from './pages/login/login.component';
import { QuestionsComponent } from './pages/questions/questions.component';
import { TripsComponent } from './pages/trips/trips.component';
import { UserComponent } from './pages/user/user.component';

const routes: Routes = [
  { path: PAGES.TRIPS, component: TripsComponent },
  { path: PAGES.QUESTIONS, component: QuestionsComponent },
  { path: PAGES.USER, component: UserComponent },
  { path: PAGES.LOGIN, component: LoginComponent },
  { path: '', component: LandingComponent },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
