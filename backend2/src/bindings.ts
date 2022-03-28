import { bindings as celestialBindings } from '@y-celestial/service';
import { Container, interfaces } from 'inversify';
import 'reflect-metadata';
import { AuthService } from './logic/AuthService';
import { SignService } from './logic/SignService';
import { TripService } from './logic/TripService';

const container: Container = new Container();

container.bind<AuthService>(AuthService).toSelf();
container.bind<SignService>(SignService).toSelf();
container.bind<TripService>(TripService).toSelf();

const mergedContainer: interfaces.Container = Container.merge(
  container,
  celestialBindings
);

export { mergedContainer as bindings };
