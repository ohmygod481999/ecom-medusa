import { Lifetime } from "awilix"
import { TransactionBaseService } from "@medusajs/utils";
import { IEventBusService } from "@medusajs/types";
import { Customer, CustomerService, GiftCard, GiftCardService, RegionService } from "@medusajs/medusa";
import {MedusaError} from 'medusa-core-utils';

export enum LoyaltyRank {
  BRONZE = 'BRONZE',
  SILVER = 'SILVER',
  GOLD = 'GOLD',
  PLATINUM = 'PLATINUM',
}

export interface LoyaltyInfo {
  totalExpense: number
  rewardBalance: number
  pointsBalance: number
  rank: LoyaltyRank
  giftCards: GiftCard[]
}

export default class LoyaltyService extends TransactionBaseService {
  static LIFE_TIME = Lifetime.SCOPED
  protected readonly eventBusService_: IEventBusService
  protected readonly customerService_: CustomerService
  protected readonly giftCardService_: GiftCardService
  protected readonly regionService_: RegionService

  constructor(
      { 
        eventBusService,
        customerService,
        giftCardService,
        regionService,
      }: { 
        eventBusService: IEventBusService
        customerService: CustomerService
        giftCardService: GiftCardService
        regionService: RegionService
      },
      options: Record<string, unknown>
  ) {
    // @ts-ignore
    super(...arguments)

    this.eventBusService_ = eventBusService
    this.customerService_ = customerService
    this.giftCardService_ = giftCardService
    this.regionService_ = regionService
  }

  getRankFromTotalExpense(totalExpense: number) {
    if (totalExpense < 5000) {
      return LoyaltyRank.BRONZE
    } else if (totalExpense < 10000) {
      return LoyaltyRank.SILVER
    } else if (totalExpense < 50000) {
      return LoyaltyRank.GOLD
    } else {
      return LoyaltyRank.PLATINUM
    }
  }

  pointsToVNDCurrency(points: number) {
    return points * 1000
  }

  vndToPointsCurrency(vnd: number) {
    return vnd / 1000
  }

  async getCustomerLoyaltyInfo(c: string | Customer): Promise<LoyaltyInfo> {
    let customer: Customer
    if (typeof c === "string") {
      customer = await this.customerService_.retrieve(c, {
        select: ["metadata"],
      })
    } else {
      customer = c
    }

    const giftCards = await this.giftCardService_.list({
      id: customer.metadata?.gift_cards || [],
    })

    const totalExpense = customer.metadata?.totalExpense as number || 0
    const rank = this.getRankFromTotalExpense(totalExpense)
    const rewardBalance = customer.metadata?.rewardBalance as number || 0

    return {
      totalExpense: customer.metadata?.totalExpense as number || 0,
      rewardBalance,
      pointsBalance: this.vndToPointsCurrency(rewardBalance),
      rank,
      giftCards,
    }
  }

  async addCustomerPoints(customerId: string, expense: number) {
    const customer = await this.customerService_.retrieve(customerId, {
      select: ["metadata"],
    })

    const loyaltyInfo = await this.getCustomerLoyaltyInfo(customer)
    const rank = loyaltyInfo.rank

    let percentOfReward = 0
    switch (rank) {
      case LoyaltyRank.BRONZE:
        percentOfReward = 0.1
        break
      case LoyaltyRank.SILVER:
        percentOfReward = 0.2
        break
      case LoyaltyRank.GOLD:
        percentOfReward = 0.3
        break
      case LoyaltyRank.PLATINUM:
        percentOfReward = 0.5
        break
    }

    // current reward balance of customer
    const currentRewardBalance: number = customer.metadata?.rewardBalance as number || 0
    const currentTotalExpense: number = customer.metadata?.totalExpense as number || 0

    // update customer's reward balance and total expense
    await this.customerService_.update(customerId, {
      metadata: {
        ...(customer.metadata || {}),
        // TODO: reward balance should be calculated from expense
        rewardBalance: currentRewardBalance + expense * percentOfReward,
        totalExpense: currentTotalExpense + expense,
      }
    })
  }

  async exchangePointsToGiftCard(customerId: string, points: number): Promise<GiftCard> {
    const customer = await this.customerService_.retrieve(customerId, {
      select: ["metadata"],
    })

    // current reward balance of customer
    const currentRewardBalance: number = customer.metadata?.rewardBalance as number || 0
    const consumedReward = this.pointsToVNDCurrency(points)

    if (consumedReward > currentRewardBalance) {
      throw new MedusaError(MedusaError.Types.INVALID_DATA, 'Not enough points');
    }


    // get first region
    const regions = await this.regionService_.list()
    const region = regions.length > 0 ? regions[0] : null

    if (!region) {
      throw new MedusaError(MedusaError.Types.INVALID_DATA, 'No region found');
    }

    // create gift card
    const giftCard = await this.giftCardService_.create({
      value: this.pointsToVNDCurrency(points),
      balance: this.pointsToVNDCurrency(points),
      region_id: region.id,
      metadata: {
        customer_id: customerId,
      }
    })


    // update customer's reward balance
    await this.customerService_.update(customerId, {
      metadata: {
        ...(customer.metadata || {}),
        rewardBalance: currentRewardBalance - consumedReward,
        gift_cards: [
          ...(customer.metadata?.gift_cards as string[] || []),
          giftCard.id,
        ],
      }
    })

    return giftCard
  }
}
