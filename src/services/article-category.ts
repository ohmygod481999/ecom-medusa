import {isDefined, MedusaError} from 'medusa-core-utils';
import {
  buildQuery,
  ExtendedFindConfig,
  FindConfig,
  TransactionBaseService,
  Selector,
  EventBusService,
} from '@medusajs/medusa';
import {EntityManager} from 'typeorm';
import {ArticleCategory} from '../models/article-category';
import ArticleCategoryRepository from '../repositories/article-category';

interface CreateArticleCategoryInput {
  title: string;
  handle?: string;
}

interface UpdateArticleCategoryInput {
  title?: string;
  handle?: string;
}

class ArticleCategoryService extends TransactionBaseService {
  protected manager_: EntityManager;
  protected transactionManager_: EntityManager;
  protected readonly eventBus_: EventBusService;

  static readonly Events = {
    UPDATED: 'article-category.updated',
    CREATED: 'article-category.created',
    DELETED: 'article-category.deleted',
  };

  private articleCategoryRepository: typeof ArticleCategoryRepository;

  constructor(container) {
    super(container);
    this.articleCategoryRepository = container.articleCategoryRepository;
    this.eventBus_ = container.eventBusService;
  }

  async retrieve_(
    selector: Selector<ArticleCategory>,
    config: FindConfig<ArticleCategory>,
  ): Promise<ArticleCategory> {
    const articleCategoryRepo = this.activeManager_.withRepository(
      this.articleCategoryRepository,
    );
    const query = buildQuery(selector, config as FindConfig<ArticleCategory>);
    const articleCategory = await articleCategoryRepo.findOne(query);

    if (!articleCategory) {
      const selectorConstraints = Object.entries(selector)
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ');

      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Article category with ${selectorConstraints} was not found`,
      );
    }

    return articleCategory;
  }

  async retrieve(
    articleCategoryId: string,
    config: FindConfig<ArticleCategory>,
  ): Promise<ArticleCategory> {
    if (!isDefined(articleCategoryId)) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `"articleCategoryId" must be defined`,
      );
    }

    return await this.retrieve_({id: articleCategoryId}, config);
  }

  async listAndCount(
    // selector: ArticleCategorySelector,
    config: FindConfig<ArticleCategory> = {
      relations: [],
      skip: 0,
      take: 20,
    },
  ): Promise<[ArticleCategory[], number]> {
    // const {q, ...productSelector} = selector;
    const query = buildQuery({}, config) as ExtendedFindConfig<ArticleCategory>;

    return await this.articleCategoryRepository.findAndCount(query);
  }

  async create(
    articleCategoryObject: CreateArticleCategoryInput,
  ): Promise<ArticleCategory> {
    let articleCategory = this.articleCategoryRepository.create(
      articleCategoryObject,
    );

    articleCategory = await this.articleCategoryRepository.save(
      articleCategory,
    );

    return articleCategory;
  }

  async update(
    id: string,
    articleCategoryObject: UpdateArticleCategoryInput,
  ): Promise<ArticleCategory> {
    const articleCategory = await this.retrieve(id, {});

    for (const [key, value] of Object.entries(articleCategoryObject)) {
      if (isDefined(value)) {
        articleCategory[key] = value;
      }
    }

    const result = await this.articleCategoryRepository.save(articleCategory);

    return result;
  }

  async delete(articleCateId: string): Promise<void> {
    return await this.atomicPhase_(async manager => {
      const articleCategoryRepo = manager.withRepository(
        this.articleCategoryRepository,
      );

      // Should not fail, if product does not exist, since delete is idempotent
      const articleCate = await articleCategoryRepo.findOne({
        where: {id: articleCateId},
      });

      if (!articleCate) {
        return;
      }

      await articleCategoryRepo.softRemove(articleCate);

      await this.eventBus_
        .withTransaction(manager)
        .emit(ArticleCategoryService.Events.DELETED, {
          id: articleCateId,
        });

      return Promise.resolve();
    });
  }
}

export default ArticleCategoryService;
