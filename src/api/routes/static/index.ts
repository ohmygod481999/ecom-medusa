import path from "path"
import express, { Router } from "express"

const staticRouter = Router()
export default function getStaticRouter(): Router {
  // storeRouter.use(bodyParser.json(), authenticate())

  staticRouter.use(
    "/uploads",
    express.static(path.join(__dirname, "../../../../uploads"))
  )

  return staticRouter
}

