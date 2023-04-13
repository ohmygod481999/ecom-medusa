import * as cors from "cors"
import { Router } from "express"
import * as bodyParser from "body-parser"
import getLoyaltyRouter from "./loyalty"
import { wrapHandler } from "@medusajs/medusa";
import 
  authenticate 
from "@medusajs/medusa/dist/api/middlewares/authenticate-customer"

const storeRouter = Router()
export default function getStoreRouter(storeCorsOptions): Router {
  // storeRouter.use(bodyParser.json(), authenticate())
  // storeRouter.use(cors(storeCorsOptions), bodyParser.json(), authenticate())

  storeRouter.use(
    "/store/loyalty",
    getLoyaltyRouter()
  )

  return storeRouter
}
