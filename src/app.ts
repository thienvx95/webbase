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
  ExpressLoader
} from '@infrastructures/startup';
import { ApiRateLimitLoader } from '@infrastructures/startup/apiRateLimit.loader';

bootstrapMicroframework({
  loaders: [
    DatabaseLoader,
    IocLoader,
    RegisterLoader,
    RoutingControllerLoader,
    ApiRateLimitLoader,
    SwaggerLoader,
    MonitorLoader,
    QueueMonitorLoader,
    PublicLoader,
    AutoMapperLoader,
    ExpressLoader
  ],
  config: {
    showBootstrapTime: true,
    debug: false,
  },
})
  .catch((e) =>{
    const log = Logging.getInstance('System');
    log.error(`Application is crashed: ${e.name}: ${e.message} ${e.stack}`)
  }
  );
