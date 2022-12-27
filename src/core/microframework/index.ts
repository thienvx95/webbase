import { Microframework } from './microframework';
import { IBootstrapConfig, ILoader } from './microframework.interface';

export * from './microframework.interface';
export * from './microframework';
export * from './settings';
export * from './shutdownHandler';

export function bootstrapMicroframework(
  configOrModules: IBootstrapConfig | ILoader[]
): Promise<Microframework> {
  const bootstrapConfig: IBootstrapConfig =
    configOrModules instanceof Array ? { loaders: configOrModules } : configOrModules;
  return new Microframework().config(bootstrapConfig.config).registerLoaders(bootstrapConfig.loaders).bootstrap();
}