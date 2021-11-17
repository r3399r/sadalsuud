import { Container } from 'inversify';
import 'reflect-metadata';
import { DemoService } from 'src/logic/DemoService';

const container: Container = new Container();

container.bind<DemoService>(DemoService).toSelf();

export { container as bindings };
