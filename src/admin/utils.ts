export const formatVietnamMoney = (amount: number): string => {
  return (amount).toLocaleString('en-US', {
    style: 'currency',
    currency: 'VND',
  })
}

export const BACKEND_URL = "http://localhost:9000"
