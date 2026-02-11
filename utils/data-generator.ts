import contactUsEmailPayload from "../request-objects/POST_support_contact_us_email.json"
import shippingCostPayload from "../request-objects/POST_shipping_cost.json"
import orderPayload from "../request-objects/POST_order.json"
import { faker } from "@faker-js/faker"

// Map the Category IDs to the number of products and their names
const categoryToProductMapping: Record<number, { numberOfProducts: number; name: string }> = {
  1: { numberOfProducts: 11, name: "Laptops" },  // Category 1: Electronics, product IDs 1–11
  2: { numberOfProducts: 7, name: "Headphones" },         // Category 2: Books, product IDs 1–7
  3: { numberOfProducts: 3, name: "Tablets" },      // Category 3: Clothing, product IDs 1–3
  4: { numberOfProducts: 7, name: "Speakers" },          // Category 4: Home, product IDs 1–7
  5: { numberOfProducts: 9, name: "Mice" }           // Category 5: Toys, product IDs 1–9
}

export function getRandomContactUsEmail() {
    const contactUsEmailRequest = structuredClone(contactUsEmailPayload)
    const { categoryId, productId } = getRandomCategoryAndProductIds()
    contactUsEmailRequest.categoryId = categoryId
    contactUsEmailRequest.email = faker.internet.email()
    contactUsEmailRequest.productId = productId
    contactUsEmailRequest.text = faker.lorem.paragraph()
    return contactUsEmailRequest
}

export function getRandomCategoryAndProductIds(): { categoryId: number; productId: number, categoryName: string } {
  // Map the object's keys into a Numbers array
  const categoryIdsArray = Object.keys(categoryToProductMapping).map(Number)
  // Draw a random Category ID from the Numbers array
  const categoryId = categoryIdsArray[Math.floor(Math.random() * categoryIdsArray.length)]
  // Retrieve the matching Object corresponding to the random Category ID
  const categoryObject = categoryToProductMapping[categoryId]
  // Draw a random Product ID from the Object's "numberOfProducts" number
  const productId = Math.floor(Math.random() * categoryObject.numberOfProducts) + 1
  const categoryName = categoryObject.name
  // Return the Category ID and the Product ID
  return { categoryId, productId, categoryName }
}

export function getShippingCostPayload() {
  return structuredClone(shippingCostPayload)
}

export function getTodaysDate() {
  const today = new Date()
  const day = String(today.getDate()).padStart(2, "0")
  const month = String(today.getMonth() + 1).padStart(2, "0")
  const year = today.getFullYear()
  return `${day}${month}${year}`
}

export function getOrderPayload(price: number, productId: number, hexColor: string) {
  const orderRequest = structuredClone(orderPayload)
  orderRequest.orderPaymentInformation.Transaction_CustomerPhone = faker.phone.number({ style: "international" })
  orderRequest.orderPaymentInformation.Transaction_MasterCredit_CVVNumber = faker.finance.creditCardCVV()
  orderRequest.orderPaymentInformation.Transaction_MasterCredit_CardNumber = faker.finance.creditCardNumber()
  orderRequest.orderPaymentInformation.Transaction_MasterCredit_CustomerName = faker.person.fullName()
  orderRequest.orderPaymentInformation.Transaction_TransactionDate = getTodaysDate()
  orderRequest.orderShippingInformation.Shipping_Cost = price
  orderRequest.purchasedProducts[0].productId = productId
  orderRequest.purchasedProducts[0].hexColor = hexColor
  return orderRequest
}
