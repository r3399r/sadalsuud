import { NgModule } from '@angular/core';
import {
  PreloadAllModules,
  Route,
  RouterModule,
  Routes,
} from '@angular/router';
import { AuthGuard } from 'src/app/auth.guard';
import { LayoutComponent } from 'src/app/components/layout/layout.component';
import { AddTripComponent } from 'src/app/pages/add-trip/add-trip.component';
import { HomeComponent } from 'src/app/pages/home/home.component';
import { LoginComponent } from 'src/app/pages/login/login.component';
import { TripDetailComponent } from 'src/app/pages/trip-detail/trip-detail.component';
import { TripListComponent } from 'src/app/pages/trip-list/trip-list.component';
import { UserProfileComponent } from 'src/app/pages/user-profile/user-profile.component';

const rootRoute: Route = {
  path: '',
  redirectTo: 'home',
  pathMatch: 'full',
};
const wildcardRoute: Route = {
  path: '**',
  redirectTo: 'home',
  pathMatch: 'full',
};

// Route children
const loginRoute: Route = {
  path: 'login',
  component: LoginComponent,
};
const homeRoute: Route = {
  path: 'home',
  component: HomeComponent,
};
const tripListRoute: Route = {
  path: 'trip-list',
  component: TripListComponent,
};
const addTripRoute: Route = {
  path: 'add-trip',
  component: AddTripComponent,
};
const tripDetailRoute: Route = {
  path: 'trip-detail/:id',
  component: TripDetailComponent,
};
const userProfileRoute: Route = {
  path: 'user-profile',
  component: UserProfileComponent,
};

// private and public Route
const privateRoute: Route = {
  path: '',
  canActivate: [AuthGuard],
  component: LayoutComponent,
  children: [userProfileRoute, addTripRoute],
};
const publicRoute: Route = {
  path: '',
  component: LayoutComponent,
  children: [homeRoute, loginRoute, tripListRoute, tripDetailRoute],
};

const routes: Routes = [rootRoute, publicRoute, privateRoute, wildcardRoute];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
