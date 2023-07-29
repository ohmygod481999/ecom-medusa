import { 
  dataSource,
} from "@medusajs/medusa/dist/loaders/database"
import { ArticleCategory } from "../models/article-category"

export const ArticleCategoryRepository = dataSource
  .getRepository(ArticleCategory)

export default ArticleCategoryRepository
