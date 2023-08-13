import { bootstrapMicroframework } from '@core/microframework/index';
import { Logging } from '@core/log';
import {
  RegisterLoader,
  IocLoader,
  DatabaseLoader,
  RoutingControllerLoader,
  AutoMapperLoader,
  MonitorLoader,
  PublicLoader,
  SwaggerLoader,
  QueueMonitorLoader,
  ExpressLoader,
  MigrationLoader,
  CacheLoader,
} from '@infrastructures/startup';
import { ApiRateLimitLoader } from '@infrastructures/startup/apiRateLimit.loader';
import { RedisCache } from '@infrastructures/caching/redis';

bootstrapMicroframework({
  loaders: [
    DatabaseLoader,
    MigrationLoader,
    CacheLoader,
    IocLoader,
    RegisterLoader,
    RoutingControllerLoader,
    ApiRateLimitLoader,
    SwaggerLoader,
    MonitorLoader,
    QueueMonitorLoader,
    PublicLoader,
    AutoMapperLoader,
    ExpressLoader,
  ],
  config: {
    showBootstrapTime: true,
    debug: false,
  },
})
  .then((framework) => {
    return framework.shutdown();
  })
  .catch((e) => {
    const log = Logging.getInstance('System');
    log.error(`Application is crashed: ${e.name}: ${e.message} ${e.stack}`);
    RedisCache.getInstance().disconnect();
  });

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

function cleanup(): void {
  RedisCache.getInstance().disconnect();
  process.exit();
}
