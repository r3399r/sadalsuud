import { Container } from 'inversify';
import 'reflect-metadata';
import { VariablesService } from 'src/logic/VariablesService';

const container: Container = new Container();

container.bind<VariablesService>(VariablesService).toSelf();

export { container as bindings };
