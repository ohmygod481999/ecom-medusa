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
  Customer,
  GiftCardService,
  transformQuery,
  wrapHandler,
} from '@medusajs/medusa';
import {NextFunction, Request, Response, Router} from 'express';
import {MedusaError} from 'medusa-core-utils';
import * as bodyParser from 'body-parser';
import ArticleService from '../../../services/article';
import {FilterableArticleProps} from '../../../types/article';
import {ArticleStatus} from '../../../models/article';
import {validator} from '../../../utils/validator';
import {EntityManager} from 'typeorm';
// import LoyaltyService from 'services/loyalty';

const articleRouter = Router();
export default function getAdminArticleRouter(): Router {
  articleRouter.use(bodyParser.json());

  // create article
  articleRouter.post(
    '/',
    wrapHandler(async (req: Request, res: Response) => {
      const validated = await validator(AdminPostArticleReq, req.body);

      const entityManager: EntityManager = req.scope.resolve('manager');
      const articleService: ArticleService = req.scope.resolve(
        'articleService',
      );

      const article = await entityManager.transaction(async manager => {
        const newArticle = await articleService
          .withTransaction(manager)
          .createArticle({...validated});

        return newArticle;
      });

      res.status(200).json({article: article});
    }),
  );

  // update article
  articleRouter.put(
    '/:id',
    wrapHandler(async (req: Request, res: Response) => {
      const {id} = req.params;

      const validated = await validator(AdminUpdateArticleReq, req.body);

      const entityManager: EntityManager = req.scope.resolve('manager');
      const articleService: ArticleService = req.scope.resolve(
        'articleService',
      );

      const article = await entityManager.transaction(async manager => {
        const newArticle = await articleService
          .withTransaction(manager)
          .update(id, {...validated});

        return newArticle;
      });

      res.status(200).json({article: article});
    }),
  );

  articleRouter.get(
    '/',
    transformQuery(AdminGetArticlesParams, {
      defaultRelations: [],
      defaultFields: [],
      isList: true,
    }),
    async (req: any, res: Response) => {
      console.log(req.listConfig);
      const {skip, take, relations} = req.listConfig;

      const articleService: ArticleService = req.scope.resolve(
        'articleService',
      );

      const [rawArticles, count] = await articleService.listAndCount(
        req.filterableFields,
        req.listConfig,
      );

      res.status(200).json({
        articles: rawArticles,
        count,
        offset: skip,
        limit: take,
      });
    },
  );

  return articleRouter;
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

export class AdminPostArticleReq {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsOptional()
  thumbnail?: string;

  @IsString()
  @IsOptional()
  handle?: string;

  @IsOptional()
  @IsEnum(ArticleStatus)
  status?: ArticleStatus = ArticleStatus.DRAFT;

  @IsOptional()
  @IsString()
  article_category_id?: string;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>;
}

export class AdminUpdateArticleReq {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  subtitle?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsOptional()
  thumbnail?: string;

  @IsString()
  @IsOptional()
  handle?: string;

  @IsOptional()
  @IsEnum(ArticleStatus)
  status?: ArticleStatus = ArticleStatus.DRAFT;

  @IsOptional()
  @IsString()
  article_category_id?: string;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>;
}
