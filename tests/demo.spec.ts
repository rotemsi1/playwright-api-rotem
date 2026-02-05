import { expect } from '../utils/custom-expect'
import { getRandomContactUsEmail } from '../utils/data-generator'
import { test } from '../utils/fixtures'

test("GET products", async ({ requestHandler }) => {
  const response = await requestHandler.path("/catalog/api/v1/categories/4/products").getRequest(200)
})

test("POST contact us", async ({ requestHandler }) => {
  // const body = {
  //   "categoryId": 1,
  //   "email": "rotem@mail.com",
  //   "productId": 7,
  //   "text": "ddsfsdsds"
  // }
  const body = getRandomContactUsEmail()
  console.log(body)
  const response = await requestHandler.path("/catalog/api/v1/support/contact_us/email").body(body).postRequest(200)
  await expect(response).isMatchingSchema("POST_support_contact_us_email_schema.json")
})
