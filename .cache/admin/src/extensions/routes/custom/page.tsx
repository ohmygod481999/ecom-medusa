import { RouteConfig } from "@medusajs/admin"

const CustomPage = () => {
  return (
    <div>
      This is my custom route 1
    </div>
  )
}

export const config: RouteConfig = {
  link: {
    label: "Custom Route",
  },
}

export default CustomPage
