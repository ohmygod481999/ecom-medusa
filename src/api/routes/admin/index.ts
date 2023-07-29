import cors from "cors"
import { Router } from "express"
import * as bodyParser from "body-parser"
import { wrapHandler } from "@medusajs/medusa";
import 
  authenticate 
from "@medusajs/medusa/dist/api/middlewares/authenticate"
import 
  errorHandler
from "@medusajs/medusa/dist/api/middlewares/error-handler"

import getAdminArticleRouter from "./article";

const adminRouter = Router()
export default function getStoreRouter(storeCorsOptions): Router {
  adminRouter.use(cors(storeCorsOptions), bodyParser.json())
  // adminRouter.use(cors(storeCorsOptions), bodyParser.json(), authenticate())

  adminRouter.use(
    "/admin/article",
    // authenticate(),
    getAdminArticleRouter()
  )

  adminRouter.use(errorHandler())


  return adminRouter
}
