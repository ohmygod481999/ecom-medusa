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
import ArticleCategoryService from '../../../services/article-category';
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

const articleCategoryRouter = Router();
export default function getArticleCategoryRouter(): Router {
  articleCategoryRouter.use(bodyParser.json());

  articleCategoryRouter.get(
    '/',
    transformStoreQuery(StoreGetArticleCategoriesParams, {
      // defaultRelations: defaultStoreProductsRelations,
      // defaultFields: defaultStoreProductsFields,
      // allowedFields: allowedStoreProductsFields,
      // allowedRelations: allowedStoreProductsRelations,
      isList: true,
    }),
    async (req: any, res: Response) => {
      const articleCategoryService: ArticleCategoryService = req.scope.resolve(
        'articleCategoryService',
      );

      const listConfig = req.listConfig;


      const [articleCategories, count] = await articleCategoryService.listAndCount(
        listConfig,
      );

      res.status(200).json({"article_categories": articleCategories, count});
    },
  );

  articleCategoryRouter.get(
    '/:id',
    wrapHandler(async (req: Request, res: Response) => {
      const {id} = req.params;

      const articleCategoryService: ArticleCategoryService = req.scope.resolve(
        'articleCategoryService',
      );
      const articleCategories = await articleCategoryService.retrieve(id, {});

      res.status(200).json({"article_category": articleCategories});
    }),
  );

  return articleCategoryRouter;
}

export class StoreGetArticleCategoriesPaginationParams extends FindParams {
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

export class StoreGetArticleCategoriesParams extends StoreGetArticleCategoriesPaginationParams {
  @IsOptional()
  @IsType([String, [String]])
  id?: string | string[];

  @IsString()
  @IsOptional()
  q?: string;

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
