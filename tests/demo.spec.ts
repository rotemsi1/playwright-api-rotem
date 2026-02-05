import { expect } from '../utils/custom-expect'
import { getRandomContactUsEmail } from '../utils/data-generator'
import { test } from '../utils/fixtures'

test("GET products", async ({ requestHandler }) => {
  const categoryId = 4
  const response = await requestHandler.path(`/catalog/api/v1/categories/${categoryId}/products`).getRequest(200)
  expect(response.categoryId).toEqual(categoryId)
})

test("POST contact us", async ({ requestHandler }) => {
  const body = getRandomContactUsEmail()
  const response = await requestHandler.path("/catalog/api/v1/support/contact_us/email").body(body).postRequest(200)
  await expect(response).isMatchingSchema("POST_support_contact_us_email_schema.json")
  expect(response.success).toEqual(true)
  expect(response.reason).toEqual("Thank you for contacting Advantage support.")
  expect(response.returnCode).toEqual(1)
})
