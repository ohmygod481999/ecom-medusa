import {Router} from 'express';
import storeRouter from './routes/store';
import adminRouter from './routes/admin';
import {getConfigFile, parseCorsOrigins} from 'medusa-core-utils';
import {ConfigModule} from '@medusajs/medusa/dist/types/global';
import cors from 'cors';

export default (rootDirectory: string): Router | Router[] => {
  const {configModule} = getConfigFile<ConfigModule>(
    rootDirectory,
    'medusa-config',
  );
  const {projectConfig} = configModule;
  const corsOptions = {
    origin: projectConfig.store_cors.split(','),
    credentials: true,
  };

  // add your custom routes here
  return [storeRouter(corsOptions), adminRouter(corsOptions)];
};
