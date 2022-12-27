import { ILoader, ISettings } from '@microframework';
import { useContainer as routingUseContainer } from 'routing-controllers';
import { Container } from 'typedi';

export const IocLoader: ILoader = async (settings: ISettings | undefined) => {
  if (settings) {
    routingUseContainer(Container);
  }
};
