import type { WidgetConfig, CustomerDetailsWidgetProps } from "@medusajs/admin"
import { formatVietnamMoney } from "../utils"

const CustomerLoyaltyWidget = ({ customer }: CustomerDetailsWidgetProps) => {
  return (
    <div className="bg-white p-8 border border-gray-200 rounded-lg">
      <h3 className="text-lg font-medium mb-4">Loyalty</h3>
      <div className="flex flex-wrap">
        Total expense: {formatVietnamMoney(customer.metadata.totalExpense as number)}
      </div>
      <div className="flex flex-wrap">
        Reward balance: {formatVietnamMoney(customer.metadata.rewardBalance as number)}
      </div>
    </div>
  )
}

export const config: WidgetConfig = {
  zone: "customer.details.after",
}

export default CustomerLoyaltyWidget
