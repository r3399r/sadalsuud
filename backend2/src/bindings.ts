import { bindings as celestialBindings } from '@y-celestial/service';
import { Container, interfaces } from 'inversify';
import 'reflect-metadata';
import { TripService } from './logic/TripService';

const container: Container = new Container();

container.bind<TripService>(TripService).toSelf();

const mergedContainer: interfaces.Container = Container.merge(
  container,
  celestialBindings
);

export { mergedContainer as bindings };
