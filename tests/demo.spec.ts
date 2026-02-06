import { expect } from '../utils/custom-expect'
import { getRandomContactUsEmail, getRandomCategoryAndProductIds as getRandomCategory } from '../utils/data-generator'
import { test } from '../utils/fixtures'

test("GET products", async ({ requestHandler }) => {
  const { categoryId, categoryName } = getRandomCategory()
  const productsResponse = await requestHandler.path(`/catalog/api/v1/categories/${categoryId}/products`).getRequest(200)
  console.log(productsResponse)
  await expect(productsResponse).isMatchingSchema("GET_products_schema.json")
  expect(productsResponse.categoryId).toEqual(categoryId)
  expect(productsResponse.categoryName).toEqual(categoryName.toUpperCase())
  expect(productsResponse.categoryImageId).toEqual(categoryName.toLowerCase())
  // Assert that all products in the "products" key-value pair have the correct category ID
  productsResponse.products.forEach((product: { categoryId: number }) => {
    expect(product.categoryId).toEqual(categoryId)
  })

  // Select a random product from the Array
  const selectedProduct = productsResponse.products[Math.floor(Math.random() * productsResponse.products.length)]
  const singleProductResponse = await requestHandler.path(`/catalog/api/v1/products/${selectedProduct.productId}`).getRequest(200)
  await expect(singleProductResponse).isMatchingSchema("GET_single_product_schema.json")
  // console.log(singleProductResponse)
  expect(singleProductResponse.productId).toEqual(selectedProduct.productId)
  expect(singleProductResponse.categoryId).toEqual(selectedProduct.categoryId)
})

test("POST contact us", async ({ requestHandler }) => {
  const body = getRandomContactUsEmail()
  const response = await requestHandler.path("/catalog/api/v1/support/contact_us/email").body(body).postRequest(200)
  await expect(response).isMatchingSchema("POST_support_contact_us_email_schema.json")
  expect(response.success).toEqual(true)
  expect(response.reason).toEqual("Thank you for contacting Advantage support.")
  expect(response.returnCode).toEqual(1)
})
