import { Customer, GiftCardService } from '@medusajs/medusa';
import {NextFunction, Request, Response, Router} from 'express';
import {MedusaError} from 'medusa-core-utils';
import * as bodyParser from "body-parser"
import 
  authenticate 
from "@medusajs/medusa/dist/api/middlewares/authenticate-customer"
import LoyaltyService from 'services/loyalty';

const loyaltyRouter = Router()
export default function getLoyaltyRouter(): Router {
  loyaltyRouter.use(bodyParser.json(), authenticate())

  loyaltyRouter.get(
    "/customer-info",
    async (req: Request, res: Response) => {
      const customer_id: string | undefined = req.user?.customer_id;

      if (!customer_id) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
        // throw new MedusaError(MedusaError.Types.UNAUTHORIZED, 'Unauthorized');
      }

      const loyaltyService: LoyaltyService = req.scope.resolve('loyaltyService');
      const customerInfo = await loyaltyService.getCustomerLoyaltyInfo(customer_id);

      res.status(200).json({ loyalty_info: customerInfo });
    }
  )

  loyaltyRouter.post(
    "/exchange-points-to-gift-card",
    async (req: Request, res: Response, next: NextFunction) => {
      const customer_id: string | undefined = req.user?.customer_id;

      if (!customer_id) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
        // throw new MedusaError(MedusaError.Types.UNAUTHORIZED, 'Unauthorized');
      }

      const points: number = req.body.points;
      if (!points) {
        res.status(400).json({ error: 'No points specified' });
        return
        // throw new MedusaError(MedusaError.Types.INVALID_DATA, 'No points specified');
      }

      try {
        const loyaltyService: LoyaltyService = req.scope.resolve('loyaltyService');
        const giftCard = await loyaltyService.exchangePointsToGiftCard(customer_id, points);

        res.status(200).json({ gift_card: giftCard });
      }
      catch (error: unknown) {
        if (error instanceof MedusaError) {
          res.status(400).json({ error: error.message });
          return;
        }
        res.status(500).json({ error: error });
      }

    }
  )

  return loyaltyRouter
}
