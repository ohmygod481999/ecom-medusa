import { 
  dataSource,
} from "@medusajs/medusa/dist/loaders/database"
import { Article } from "../models/article"

export const ArticleRepository = dataSource
  .getRepository(Article)

export default ArticleRepository
