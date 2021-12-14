import { bindings as celestialBindings } from '@y-celestial/service';
import { Container, interfaces } from 'inversify';
import 'reflect-metadata';
import { AuthService } from 'src/logic/AuthService';
import { VariablesService } from 'src/logic/VariablesService';
import { LineService } from './logic/LineService';
import { StarService } from './logic/StarService';
import { UserService } from './logic/UserService';

const container: Container = new Container();

container.bind<AuthService>(AuthService).toSelf();
container.bind<UserService>(UserService).toSelf();
container.bind<StarService>(StarService).toSelf();
container.bind<VariablesService>(VariablesService).toSelf();
container.bind<LineService>(LineService).toSelf();

const mergedContainer: interfaces.Container = Container.merge(
  container,
  celestialBindings
);

export { mergedContainer as bindings };
