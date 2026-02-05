import contactUsEmailPayload from "../request-objects/POST_support_contact_us_email.json"
import { faker } from "@faker-js/faker"

const categoryToProductMapping: Record<number, number> = {
  1: 11,  // Category 1 has product IDs 1–11
  2: 7,   // Category 2 has product IDs 1–7
  3: 3,   // Category 3 has product IDs 1-3
  4: 7,   // Category 4 has product IDs 1-7
  5: 9    // Category 5 has product IDs 1-9
}

export function getRandomContactUsEmail() {
    const contactUsEmailRequest = structuredClone(contactUsEmailPayload)
    const { categoryId, productId } = getRandomCategoryAndProductIds(categoryToProductMapping)
    contactUsEmailRequest.categoryId = categoryId
    contactUsEmailRequest.email = faker.internet.email()
    contactUsEmailRequest.productId = productId
    contactUsEmailRequest.text = faker.lorem.paragraph()
    return contactUsEmailRequest
}

function getRandomCategoryAndProductIds(mapping: Record<number, number>): { categoryId: number; productId: number } {
  const categoryIdsArray = Object.keys(mapping).map(Number)
  const categoryId = categoryIdsArray[Math.floor(Math.random() * categoryIdsArray.length)]
  const maxProductId = mapping[categoryId]
  const productId = Math.floor(Math.random() * maxProductId) + 1
  return { categoryId, productId }
}
