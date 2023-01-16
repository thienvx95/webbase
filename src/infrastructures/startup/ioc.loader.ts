import { ILoader, ISettings } from '@microframework';
import { useContainer } from 'routing-controllers';
import { Container } from 'inversify';
import { InversifyAdapter } from '@infrastructures/adapter/inversify.adapter';
import { repositories } from '@infrastructures/modules/repositories';
import { services } from '@infrastructures/modules/services';
import { common } from '@infrastructures/modules/common';

export const IocLoader: ILoader = async (settings: ISettings | undefined) => {
  if (settings) {
    const container = new Container();
    const inversifyAdapter = new InversifyAdapter(container);
    repositories(container);
    services(container);
    common(container);
    useContainer(inversifyAdapter);
    settings.setData('container', container);
  }
};
