import cors from 'cors';
import {Router} from 'express';
import * as bodyParser from 'body-parser';
import {wrapHandler} from '@medusajs/medusa';
import authenticate from '@medusajs/medusa/dist/api/middlewares/authenticate';
import errorHandler from '@medusajs/medusa/dist/api/middlewares/error-handler';
import proxy from 'express-http-proxy';

import getAdminArticleRouter from './article';
import getAdminArticleCategoryRouter from './article-category';
import getAdminThemeRouter from './theme';

const adminRouter = Router();
export default function getStoreRouter(storeCorsOptions): Router {
  adminRouter.use(
    '/admin/proxy',
    proxy('http://longvb.ddns.net:8088', {
      proxyReqPathResolver: function(req: Request) {
        return "/api/admin" + req.url
      },
    }),
  );

  adminRouter.use(cors(storeCorsOptions), bodyParser.json());
  // adminRouter.use(cors(storeCorsOptions), bodyParser.json(), authenticate())

  adminRouter.use(
    '/admin/article',
    // authenticate(),
    getAdminArticleRouter(),
  );

  adminRouter.use(
    '/admin/article-category',
    // authenticate(),
    getAdminArticleCategoryRouter(),
  );

  adminRouter.use(
    '/admin/theme',
    // authenticate(),
    getAdminThemeRouter(),
  );

  // adminRouter.use(
  //   '/admin/proxy',
  //   // authenticate(),
  //   proxy('http://longvb.ddns.net:8088/api/admin'),
  // );

  adminRouter.use(errorHandler());

  return adminRouter;
}
