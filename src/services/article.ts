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
import {Article, ArticleStatus} from '../models/article';
import {ArticleRepository} from '../repositories/article';
import {ArticleSelector} from '../types/article';

interface CreateArticleInput {
  title: string;
  handle?: string;
  thumbnail?: string;
  content?: string;
  status?: ArticleStatus;
  article_category_id?: string;
}

interface UpdateArticleInput {
  title?: string;
  handle?: string;
  thumbnail?: string;
  content?: string;
  status?: ArticleStatus;
  article_category_id?: string;
}

class ArticleService extends TransactionBaseService {
  protected manager_: EntityManager;
  protected transactionManager_: EntityManager;
  protected readonly eventBus_: EventBusService

  static readonly Events = {
    UPDATED: "product.updated",
    CREATED: "product.created",
    DELETED: "product.deleted",
  }



  private articleRepository: typeof ArticleRepository;

  constructor(container) {
    super(container);
    this.articleRepository = container.articleRepository;
    this.eventBus_ = container.eventBusService

  }

  async retrieve_(
    selector: Selector<Article>,
    config: FindConfig<Article>,
  ): Promise<Article> {
    const articleRepo = this.activeManager_.withRepository(
      this.articleRepository,
    );
    const query = buildQuery(selector, config as FindConfig<Article>);
    const article = await articleRepo.findOne(query);

    if (!article) {
      const selectorConstraints = Object.entries(selector)
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ');

      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Article with ${selectorConstraints} was not found`,
      );
    }

    return article;
  }

  async retrieve(
    articleId: string,
    config: FindConfig<Article>,
  ): Promise<Article> {
    if (!isDefined(articleId)) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `"productId" must be defined`,
      );
    }

    config.relations = ['article_category'];

    return await this.retrieve_({id: articleId}, config);
  }

  async listAndCount(
    selector: ArticleSelector,
    config: FindConfig<Article> = {
      relations: [],
      skip: 0,
      take: 20,
    },
  ): Promise<[Article[], number]> {
    const {q, ...productSelector} = selector;
    const query = buildQuery(productSelector, config) as ExtendedFindConfig<
      Article
    >;

    return await this.articleRepository.findAndCount(query);
  }

  async createArticle(articleObject: CreateArticleInput): Promise<Article> {
    let product = this.articleRepository.create(articleObject);

    product = await this.articleRepository.save(product);

    return product;
  }

  async update(
    id: string,
    articleObject: UpdateArticleInput,
  ): Promise<Article> {
    const article = await this.retrieve(id, {});

    for (const [key, value] of Object.entries(articleObject)) {
      if (isDefined(value)) {
        article[key] = value;
      }
    }

    const result = await this.articleRepository.save(article);

    return result;
  }

  async delete(articleId: string): Promise<void> {
    return await this.atomicPhase_(async manager => {
      const articleRepo = manager.withRepository(this.articleRepository);

      // Should not fail, if product does not exist, since delete is idempotent
      const product = await articleRepo.findOne({
        where: {id: articleId},
      });

      if (!product) {
        return;
      }

      await articleRepo.softRemove(product);

      await this.eventBus_
        .withTransaction(manager)
        .emit(ArticleService.Events.DELETED, {
          id: articleId,
        });

      return Promise.resolve();
    });
  }
}

export default ArticleService;
