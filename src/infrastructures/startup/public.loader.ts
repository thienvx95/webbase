import { ILoader, ISettings } from '@microframework';
import * as path from 'path';
import * as express from 'express';
import * as favicon from 'serve-favicon';

export const PublicLoader: ILoader = async (
  settings: ISettings | undefined,
) => {
  if (settings) {
    const expressApp = settings.getData<express.Express>('express_app');
    // Loads Options
    const options = { maxAge: 31557600000 };
    expressApp.use(
      '/public',
      express.static(path.join(__dirname, '../../public'), options),
    );
    expressApp.use(
      favicon(path.join(__dirname, '../../../public', 'favicon.ico')),
    );
  }
};
