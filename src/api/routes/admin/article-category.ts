import {
  IsNumber,
  IsOptional,
  IsString,
  IsArray,
  IsEnum,
  IsObject,
} from 'class-validator';
import {Type} from 'class-transformer';

import {
  transformQuery,
  wrapHandler,
} from '@medusajs/medusa';
import {Request, Response, Router} from 'express';
import {MedusaError} from 'medusa-core-utils';
import * as bodyParser from 'body-parser';
import ArticleCategoryService from '../../../services/article-category';
import {FilterableArticleProps} from '../../../types/article';
import {validator} from '../../../utils/validator';
import {EntityManager} from 'typeorm';
// import LoyaltyService from 'services/loyalty';

const articleCategoryRouter = Router();
export default function getAdminArticleCategoryRouter(): Router {
  articleCategoryRouter.use(bodyParser.json());

  // create article category
  articleCategoryRouter.post(
    '/',
    wrapHandler(async (req: Request, res: Response) => {
      const validated = await validator(AdminPostArticleCategoryReq, req.body);

      const entityManager: EntityManager = req.scope.resolve('manager');
      const articleCategoryService: ArticleCategoryService = req.scope.resolve(
        'articleCategoryService',
      );

      const articleCate = await entityManager.transaction(async manager => {
        const newArticleCate = await articleCategoryService
          .withTransaction(manager)
          .create({...validated});

        return newArticleCate;
      });

      res.status(200).json({"article_category": articleCate});
    }),
  );

  // update article
  articleCategoryRouter.put(
    '/:id',
    wrapHandler(async (req: Request, res: Response) => {
      const {id} = req.params;

      const validated = await validator(AdminUpdateArticleCategoryReq, req.body);

      const entityManager: EntityManager = req.scope.resolve('manager');
      const articleCategoryService: ArticleCategoryService = req.scope.resolve(
        'articleCategoryService',
      );

      const article = await entityManager.transaction(async manager => {
        const newArticleCategory = await articleCategoryService
          .withTransaction(manager)
          .update(id, {...validated});

        return newArticleCategory;
      });

      res.status(200).json({"article_category": article});
    }),
  );

  // delete article category
  articleCategoryRouter.delete(
    '/:id',
    wrapHandler(async (req: Request, res: Response) => {
      const {id} = req.params;

      const articleCategoryService: ArticleCategoryService = req.scope.resolve(
        'articleCategoryService',
      );
      const manager: EntityManager = req.scope.resolve('manager');
      await manager.transaction(async transactionManager => {
        return await articleCategoryService
          .withTransaction(transactionManager)
          .delete(id);
      });

      res.json({
        id,
        object: 'article_category',
        deleted: true,
      });
    }),
  );


  articleCategoryRouter.get(
    '/',
    transformQuery(AdminGetArticlesParams, {
      defaultRelations: [],
      defaultFields: [],
      isList: true,
    }),
    async (req: any, res: Response) => {
      console.log(req.listConfig);
      const {skip, take, relations} = req.listConfig;

      const articleCategoryService: ArticleCategoryService = req.scope.resolve(
        'articleCategoryService',
      );

      const [rawArticleCategories, count] = await articleCategoryService.listAndCount(
        req.listConfig,
      );

      res.status(200).json({
        "article_categories": rawArticleCategories,
        count,
        offset: skip,
        limit: take,
      });
    },
  );

  return articleCategoryRouter;
}

export class AdminGetArticlesParams extends FilterableArticleProps {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  offset?: number = 0;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit?: number = 50;

  @IsString()
  @IsOptional()
  expand?: string;

  @IsString()
  @IsOptional()
  fields?: string;

  @IsString()
  @IsOptional()
  order?: string;
}

export class AdminPostArticleCategoryReq {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  handle?: string;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>;
}

export class AdminUpdateArticleCategoryReq {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  handle?: string;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>;
}
