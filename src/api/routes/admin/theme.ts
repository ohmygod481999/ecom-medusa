import {
  IsNumber,
  IsOptional,
  IsString,
  IsArray,
  IsEnum,
  IsObject,
  IsNotEmpty,
} from 'class-validator';
import {wrapHandler} from '@medusajs/medusa';
import bodyParser from 'body-parser';
import {Request, Response, Router} from 'express';
import {Theme, ThemeList} from '../../../models/theme';
import ThemeService from '../../../services/theme';
import {validator} from '../../../utils/validator';
import {EntityManager} from 'typeorm';

const themeRouter = Router();
export default function getAdminThemeRouter(): Router {
  themeRouter.use(bodyParser.json());

  // create theme
  themeRouter.post(
    '/',
    wrapHandler(async (req: Request, res: Response) => {
      const validated = await validator(AdminPostThemeReq, req.body);

      const entityManager: EntityManager = req.scope.resolve('manager');
      const themeService: ThemeService = req.scope.resolve('themeService');

      const theme = await entityManager.transaction(async manager => {
        const newTheme = await themeService
          .withTransaction(manager)
          .create({...validated});

        return newTheme;
      });

      res.status(200).json({theme});
    }),
  );

  themeRouter.put(
    '/:id',
    wrapHandler(async (req: Request, res: Response) => {
      const {id} = req.params;

      const validated = await validator(AdminUpdateThemeReq, req.body);

      const entityManager: EntityManager = req.scope.resolve('manager');
      const themeService: ThemeService = req.scope.resolve('themeService');

      const theme = await entityManager.transaction(async manager => {
        const newTheme = await themeService
          .withTransaction(manager)
          .update(id, {...validated});

        return newTheme;
      });

      res.status(200).json({theme});
    }),
  );

  themeRouter.post(
    '/set-current-theme',
    wrapHandler(async (req: Request, res: Response) => {
      const validated = await validator(AdminSetCurrentThemeReq, req.body);

      const entityManager: EntityManager = req.scope.resolve('manager');
      const themeService: ThemeService = req.scope.resolve('themeService');

      const theme = await themeService.retrieve(validated.theme_id);

      await entityManager.transaction(async manager => {
        await themeService.withTransaction(manager).setCurrentTheme(theme.id);
      });

      res.status(200).json({});
    }),
  );

  themeRouter.get('/:id', async (req: Request, res: Response) => {
   const {id} = req.params;
    const themeService: ThemeService = req.scope.resolve('themeService');

    const theme: Theme = await themeService.retrieve(id);

    res.status(200).json({
      theme: theme,
    });
  });

  themeRouter.get('/', async (req: Request, res: Response) => {
    const themeService: ThemeService = req.scope.resolve('themeService');

    const themeList: ThemeList = await themeService.getListTheme();

    res.status(200).json({
      theme_list: themeList,
    });
  });

  return themeRouter;
}

class AdminPostThemeReq {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  url: string;

  @IsString()
  @IsOptional()
  thumbnail?: string;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>;
}

class AdminUpdateThemeReq {
  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  url: string;

  @IsString()
  @IsOptional()
  thumbnail?: string;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>;
}

class AdminSetCurrentThemeReq {
  @IsString()
  @IsNotEmpty()
  theme_id: string;
}
