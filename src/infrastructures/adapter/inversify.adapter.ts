import { ClassConstructor, IocAdapter } from 'routing-controllers';
import { Container } from 'inversify';

export class InversifyAdapter implements IocAdapter {
  constructor(private readonly container: Container) {}

  get<T>(someClass: ClassConstructor<T>): T {
    const childContainer = this.container.createChild();
    return childContainer.resolve<T>(someClass);
  }
}