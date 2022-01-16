import { bindings as celestialBindings } from '@y-celestial/service';
import { Container, interfaces } from 'inversify';
import 'reflect-metadata';
import { AuthService } from 'src/logic/AuthService';
import { VariablesService } from 'src/logic/VariablesService';
import { GroupService } from './logic/GroupService';
import { LineService } from './logic/LineService';
import { MeService } from './logic/MeService';
import { StarService } from './logic/StarService';
import { TripService } from './logic/TripService';
import { UserService } from './logic/UserService';

const container: Container = new Container();

container.bind<AuthService>(AuthService).toSelf();
container.bind<GroupService>(GroupService).toSelf();
container.bind<UserService>(UserService).toSelf();
container.bind<StarService>(StarService).toSelf();
container.bind<VariablesService>(VariablesService).toSelf();
container.bind<LineService>(LineService).toSelf();
container.bind<TripService>(TripService).toSelf();
container.bind<MeService>(MeService).toSelf();

const mergedContainer: interfaces.Container = Container.merge(
  container,
  celestialBindings
);

export { mergedContainer as bindings };
