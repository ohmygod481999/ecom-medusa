import cors from "cors"
import { Router } from "express"
import * as bodyParser from "body-parser"
import getLoyaltyRouter from "./loyalty"
import { wrapHandler } from "@medusajs/medusa";
import 
  authenticate 
from "@medusajs/medusa/dist/api/middlewares/authenticate-customer"
import 
  errorHandler
from "@medusajs/medusa/dist/api/middlewares/error-handler"
import getArticleRouter from "./article";

const storeRouter = Router()
export default function getStoreRouter(storeCorsOptions): Router {
  // storeRouter.use(bodyParser.json(), authenticate())
  storeRouter.use(cors(storeCorsOptions), bodyParser.json(), authenticate())

  storeRouter.use(
    "/store/loyalty",
    getLoyaltyRouter()
  )

  storeRouter.use(
    "/store/article",
    getArticleRouter()
  )


  storeRouter.use(errorHandler())

  return storeRouter
}
