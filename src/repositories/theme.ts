import { 
  dataSource,
} from "@medusajs/medusa/dist/loaders/database"
import { Theme } from "../models/theme"

export const ThemeRepository = dataSource
  .getRepository(Theme)

export default ThemeRepository
