import {
  Customer,
  DateComparisonOperator,
  FindParams,
  GiftCardService,
  transformStoreQuery,
  wrapHandler,
} from '@medusajs/medusa';
import {NextFunction, Request, Response, Router} from 'express';
import {MedusaError} from 'medusa-core-utils';
import * as bodyParser from 'body-parser';
import ArticleService from '../../../services/article';
// import LoyaltyService from 'services/loyalty';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import {Transform, Type} from 'class-transformer';
import {IsType} from '../../../utils/validators/is-type';

const articleRouter = Router();
export default function getArticleRouter(): Router {
  articleRouter.use(bodyParser.json());

  articleRouter.get(
    '/',
    transformStoreQuery(StoreGetArticlesParams, {
      // defaultRelations: defaultStoreProductsRelations,
      // defaultFields: defaultStoreProductsFields,
      // allowedFields: allowedStoreProductsFields,
      // allowedRelations: allowedStoreProductsRelations,
      isList: true,
    }),
    async (req: any, res: Response) => {
      const articleService: ArticleService = req.scope.resolve(
        'articleService',
      );

      let {...filterableFields} = req.filterableFields;

      const listConfig = req.listConfig;

      // get only published article for store endpoint
      filterableFields['status'] = ['published'];
      // store APIs only receive active and public categories to query from

      const [articles, count] = await articleService.listAndCount(
        filterableFields,
        listConfig,
      );

      res.status(200).json({articles: articles, count});
    },
  );

  articleRouter.get(
    '/:id',
    wrapHandler(async (req: Request, res: Response) => {
      const {id} = req.params;

      const articleService: ArticleService = req.scope.resolve(
        'articleService',
      );
      const article = await articleService.retrieve(id, {});

      res.status(200).json({article});
    }),
  );

  return articleRouter;
}

export class StoreGetArticlesPaginationParams extends FindParams {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  offset?: number = 0;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit?: number = 100;

  @IsString()
  @IsOptional()
  order?: string;
}

export class StoreGetArticlesParams extends StoreGetArticlesPaginationParams {
  @IsOptional()
  @IsType([String, [String]])
  id?: string | string[];

  @IsString()
  @IsOptional()
  q?: string;

  @IsArray()
  @IsOptional()
  article_category_id?: string[];

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  handle?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => DateComparisonOperator)
  created_at?: DateComparisonOperator;

  @IsOptional()
  @ValidateNested()
  @Type(() => DateComparisonOperator)
  updated_at?: DateComparisonOperator;
}
