import { bindings as celestialBindings } from '@y-celestial/service';
import { Container, interfaces } from 'inversify';
import 'reflect-metadata';
import { AuthService } from './logic/AuthService';
import { SignService } from './logic/SignService';
import { TripService } from './logic/TripService';
import { SignModel } from './model/entity/Sign';
import { TripModel } from './model/entity/Trip';

const container: Container = new Container();

container.bind<SignModel>(SignModel).toSelf();
container.bind<TripModel>(TripModel).toSelf();

container.bind<AuthService>(AuthService).toSelf();
container.bind<SignService>(SignService).toSelf();
container.bind<TripService>(TripService).toSelf();

const mergedContainer: interfaces.Container = Container.merge(
  container,
  celestialBindings
);

export { mergedContainer as bindings };
