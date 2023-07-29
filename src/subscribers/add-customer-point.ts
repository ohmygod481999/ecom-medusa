import { EntityManager } from "typeorm";
import { CustomerService, Order, OrderService, TotalsService } from "@medusajs/medusa";
import { IEventBusService } from "@medusajs/types";
import LoyaltyService from "../services/loyalty";

export default class AddCustomerPointSubscriber {
  protected readonly manager_: EntityManager;
  protected readonly customerService_: CustomerService
  protected readonly orderService_: OrderService
  protected readonly totalsService_: TotalsService
  protected readonly loyaltyService_: LoyaltyService

  constructor(
    {
      manager,
      eventBusService,
      customerService,
      orderService,
      totalsService,
      loyaltyService,
    }: {
      manager: EntityManager;
      eventBusService: IEventBusService;
      customerService: CustomerService;
      orderService: OrderService;
      totalsService: TotalsService;
      loyaltyService: LoyaltyService;
    }
  ) {
    this.manager_ = manager;
    this.customerService_ = customerService;
    this.orderService_ = orderService;
    this.totalsService_ = totalsService;
    this.loyaltyService_ = loyaltyService;

    // eventBusService.subscribe(OrderService.Events.PLACED, this.handleOrderPlaced);
    eventBusService.subscribe(OrderService.Events.COMPLETED, this.handleOrderPlaced);
  }

  handleOrderPlaced = async (data: Order): Promise<void> => {
    const orderId = data.id;
    // retrieve order with totals
    let order = await this.orderService_.retrieveWithTotals(orderId)

    // retrieve customer
    const customerId = order.customer_id;
    await this.loyaltyService_.addCustomerPoints(customerId, order.subtotal || 0);
    return;
  }
}
