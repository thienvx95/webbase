import { ILoader, ISettings } from '@microframework';
import { Express } from 'express';
import * as basicAuth from 'express-basic-auth';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { getMetadataArgsStorage } from 'routing-controllers';
import { routingControllersToSpec } from '@routing-controllers-openapi';
import * as swaggerUi from 'swagger-ui-express';
import { ISystemConfig } from '@core/configuration/systemConfig.interface';

export const SwaggerLoader: ILoader = async (
  settings: ISettings | undefined,
) => {
  if (settings) {
    const expressApp = settings.getData<Express>('express_app');
    const configs = settings.getData<ISystemConfig>('configs');
    if(!configs.SwaggerSetting.Enable) return;
    const schemas = validationMetadatasToSchemas({
      refPointerPrefix: '#/components/schemas/',
    });
    const specifications = routingControllersToSpec(
      getMetadataArgsStorage(),
      {},
      {
        components: {
          schemas,
          securitySchemes: {
            jwt: {
              scheme: 'bearer',
              type: 'http',
              bearerFormat: 'JWT',
            },
          },
        },
        security: [{ jwt: [] }],
        info: {
          title: configs.AppInfo.Name,
          description: configs.AppInfo.Name,
          version: 'v1.0.0',
        },
        servers: [
          {
            url: `${configs.AppInfo.Schema}://${configs.AppInfo.Host}:${configs.AppInfo.Port}/${configs.AppSetting.APIPrefix}`,
          },
        ],
      },
    );
    expressApp.use(
      configs.SwaggerSetting.Route,
      configs.SwaggerSetting.User
        ? basicAuth({
            users: {
              [`${configs.SwaggerSetting.User}`]:
                configs.SwaggerSetting.Password,
            },
            challenge: true,
          })
        : (_req: any, _res: any, next: any) => next(),
      swaggerUi.serve,
      swaggerUi.setup(specifications),
    );
  }
};
