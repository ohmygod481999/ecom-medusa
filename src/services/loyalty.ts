import { Lifetime } from "awilix"
import { TransactionBaseService } from "@medusajs/medusa";
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
    if (totalExpense < 5000000) {
      return LoyaltyRank.BRONZE
    } else if (totalExpense < 10000000) {
      return LoyaltyRank.SILVER
    } else if (totalExpense < 30000000) {
      return LoyaltyRank.GOLD
    } else {
      return LoyaltyRank.PLATINUM
    }
  }

  pointsToVNDCurrency(points: number) {
    return points * 100
  }

  vndToPointsCurrency(vnd: number) {
    return vnd / 100
  }

  async getCustomerLoyaltyInfo(c: string | Customer): Promise<LoyaltyInfo> {
    let customer: Customer
    console.log("Customer is", c);
    if (typeof c === "string") {
      console.log("Customer is string", c);
      customer = await this.customerService_.retrieve(c, {
        // select: ["metadata"],
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

  getPercentOfReward(rank: LoyaltyRank): number {
    let percentOfReward = 0
    switch (rank) {
      case LoyaltyRank.BRONZE:
        percentOfReward = 0.01
        break
      case LoyaltyRank.SILVER:
        percentOfReward = 0.02
        break
      case LoyaltyRank.GOLD:
        percentOfReward = 0.03
        break
      case LoyaltyRank.PLATINUM:
        percentOfReward = 0.04
        break
    }
    
    return percentOfReward
  }

  getNextRank(rank: LoyaltyRank): LoyaltyRank {
    switch (rank) {
      case LoyaltyRank.BRONZE:
        return LoyaltyRank.SILVER
      case LoyaltyRank.SILVER:
        return LoyaltyRank.GOLD
      case LoyaltyRank.GOLD:
        return LoyaltyRank.PLATINUM
      case LoyaltyRank.PLATINUM:
        return LoyaltyRank.PLATINUM
    }
  }

  getCheckpoint(rank: LoyaltyRank): number {
    switch (rank) {
      case LoyaltyRank.BRONZE:
        return 0
      case LoyaltyRank.SILVER:
        return 5000000
      case LoyaltyRank.GOLD:
        return 10000000
      case LoyaltyRank.PLATINUM:
        return 30000000
    }
  }

  async addCustomerPoints(customerId: string, expense: number) {
    console.log("Add customer points");
    const customer = await this.customerService_.retrieve(customerId, {
      // select: ["metadata"],
    })
    // current reward balance of customer

    const loyaltyInfo = await this.getCustomerLoyaltyInfo(customer)

    const rewardBalance = loyaltyInfo.rewardBalance ? loyaltyInfo.rewardBalance : 0
    const totalExpense = loyaltyInfo.totalExpense ? loyaltyInfo.totalExpense : 0

    let currentTotalExpense: number = totalExpense
    let currentRank = loyaltyInfo.rank
    let percentOfReward = this.getPercentOfReward(currentRank)
    let clone_expense = expense // 15.000.000

    let rewardBalanceToAdd = 0

    while (clone_expense > 0) {
      if (currentRank === LoyaltyRank.PLATINUM) {
        rewardBalanceToAdd += clone_expense * percentOfReward
        break
      }
      
      // let checkpoint = this.getCheckpoint(currentRank)
      let nextRank = this.getNextRank(currentRank)
      let nextCheckpoint = this.getCheckpoint(nextRank)

      if (currentTotalExpense + clone_expense > nextCheckpoint) {
        rewardBalanceToAdd += (nextCheckpoint - currentTotalExpense) * percentOfReward
        currentRank = nextRank
        clone_expense -= (nextCheckpoint - currentTotalExpense)
        currentTotalExpense = nextCheckpoint
        percentOfReward = this.getPercentOfReward(currentRank)
      } else {
        rewardBalanceToAdd += clone_expense * percentOfReward
        currentTotalExpense += clone_expense
        clone_expense = 0
      }
      console.log("-- Reward balance to add: ", rewardBalanceToAdd);
      console.log("-- Expense: ", clone_expense);
      console.log("-- rank: ", currentRank);
    }

    console.log("Reward balance to add: ", rewardBalanceToAdd);
    console.log("Expense: ", expense);
    console.log("Loyalty info: ", loyaltyInfo);


    // update customer's reward balance and total expense
    await this.customerService_.update(customerId, {
      metadata: {
        ...(customer.metadata || {}),
        // TODO: reward balance should be calculated from expense
        rewardBalance: rewardBalance + rewardBalanceToAdd,
        totalExpense: totalExpense + expense,
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

    if (points <= 0) {
      throw new MedusaError(MedusaError.Types.INVALID_DATA, 'Invalid points');
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
