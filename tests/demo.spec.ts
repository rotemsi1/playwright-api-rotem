import { expect } from '../utils/custom-expect'
import { getRandomContactUsEmail, getRandomCategoryAndProductIds as getRandomCategory } from '../utils/data-generator'
import { test } from '../utils/fixtures'

const USER_ID = "396604504"

test("Purchase a product", async ({ requestHandler }) => {

  // Select a random category
  const { categoryId, categoryName } = getRandomCategory()
  const productsResponse = await requestHandler.path(`/catalog/api/v1/categories/${categoryId}/products`).getRequest(200)
  await expect(productsResponse).isMatchingSchema("GET_products_schema.json")
  expect(productsResponse.categoryId).toEqual(categoryId)
  expect(productsResponse.categoryName).toEqual(categoryName.toUpperCase())
  expect(productsResponse.categoryImageId).toEqual(categoryName.toLowerCase())
  // Assert that all products in the "products" key-value pair have the correct category ID
  productsResponse.products.forEach((product: { categoryId: number }) => {
    expect(product.categoryId).toEqual(categoryId)
  })

  // Select a random product from the category
  const selectedProduct = productsResponse.products[Math.floor(Math.random() * productsResponse.products.length)]
  const singleProductResponse = await requestHandler.path(`/catalog/api/v1/products/${selectedProduct.productId}`).getRequest(200)
  await expect(singleProductResponse).isMatchingSchema("GET_single_product_schema.json")
  console.log(singleProductResponse)
  // Assert all single product values against the values from the response
  expect(singleProductResponse.productId).toEqual(selectedProduct.productId)
  expect(singleProductResponse.categoryId).toEqual(selectedProduct.categoryId)
  expect(singleProductResponse.productName).toEqual(selectedProduct.productName)
  expect(singleProductResponse.price).toEqual(selectedProduct.price)
  expect(singleProductResponse.description).toEqual(selectedProduct.description)
  expect(singleProductResponse.imageUrl).toEqual(selectedProduct.imageUrl)
  expect(singleProductResponse.productStatus).toEqual(selectedProduct.productStatus)

  // Add to cart
  // Select a random product color
  const selectedColor = singleProductResponse.colors[Math.floor(Math.random() * singleProductResponse.colors.length)]
  const addToCartResponse = await requestHandler
      .path(`/order/api/v1/carts/${USER_ID}/product/${selectedProduct.productId}/color/${selectedColor.code}?quantity=1`)
      .headers({Authorization: "Basic cm90ZW1zaW46VXNlcjEyMzQh"})
      .postRequest(201)

  // 19c42b06367@7EA29D3815^i%396604504


})

test("POST contact us", async ({ requestHandler }) => {
  const body = getRandomContactUsEmail()
  const response = await requestHandler.path("/catalog/api/v1/support/contact_us/email").body(body).postRequest(200)
  await expect(response).isMatchingSchema("POST_support_contact_us_email_schema.json")
  expect(response.success).toEqual(true)
  expect(response.reason).toEqual("Thank you for contacting Advantage support.")
  expect(response.returnCode).toEqual(1)
})
