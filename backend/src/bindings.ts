import { Container } from 'inversify';
import 'reflect-metadata';
import { SignAccess } from './access/SignAccess';
import { TripAccess } from './access/TripAccess';
import { ViewTripDetailAccess } from './access/ViewTripDetailAccess';
import { AuthService } from './logic/AuthService';
import { SignService } from './logic/SignService';
import { TripService } from './logic/TripService';
import { SignEntity } from './model/entity/SignEntity';
import { TripEntity } from './model/entity/TripEntity';
import { ViewTripDetailEntity } from './model/viewEntity/ViewTripDetailEntity';
import { Database, dbEntitiesBindingId } from './util/database';

const container: Container = new Container();

container.bind<Database>(Database).toSelf().inSingletonScope();

// bind repeatedly forr db entities
container.bind<Function>(dbEntitiesBindingId).toFunction(SignEntity);
container.bind<Function>(dbEntitiesBindingId).toFunction(TripEntity);
container.bind<Function>(dbEntitiesBindingId).toFunction(ViewTripDetailEntity);

// db access for tables
container.bind<SignAccess>(SignAccess).toSelf();
container.bind<TripAccess>(TripAccess).toSelf();

// db access for views
container.bind<ViewTripDetailAccess>(ViewTripDetailAccess).toSelf();

// services
container.bind<AuthService>(AuthService).toSelf();
container.bind<SignService>(SignService).toSelf();
container.bind<TripService>(TripService).toSelf();

export { container as bindings };
