import { Container } from 'inversify';
import 'reflect-metadata';
import { AuthService } from 'src/logic/AuthService';
import { VariablesService } from 'src/logic/VariablesService';

const container: Container = new Container();

container.bind<AuthService>(AuthService).toSelf();
container.bind<VariablesService>(VariablesService).toSelf();

export { container as bindings };
