import { expect } from '../utils/custom-expect'
import { getRandomContactUsEmail, 
         getRandomCategoryAndProductIds as getRandomCategory, 
         getShippingCostPayload, 
         getTodaysDate,
         getOrderPayload
       } from '../utils/data-generator'
import { test } from '../utils/fixtures'

const USER_ID = "740281360"
const BASIC_AUTHORIZATION = "Basic cm90ZW1zaW4xOlVzZXIxMjM0IQ"

test("Purchase a product", async ({ requestHandler }) => {

  // SELECT A RANDOM CATEGORY

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

  // SELECT A RANDOM PRODUCT FROM THE CATEGORY

  const selectedProduct = productsResponse.products[Math.floor(Math.random() * productsResponse.products.length)]
  const singleProductResponse = await requestHandler.path(`/catalog/api/v1/products/${selectedProduct.productId}`).getRequest(200)
  await expect(singleProductResponse).isMatchingSchema("GET_single_product_schema.json")
  // Assert all single product values against the values from the response
  expect(singleProductResponse.productId).toEqual(selectedProduct.productId)
  expect(singleProductResponse.categoryId).toEqual(selectedProduct.categoryId)
  expect(singleProductResponse.productName).toEqual(selectedProduct.productName)
  expect(singleProductResponse.price).toEqual(selectedProduct.price)
  expect(singleProductResponse.description).toEqual(selectedProduct.description)
  expect(singleProductResponse.imageUrl).toEqual(selectedProduct.imageUrl)
  expect(singleProductResponse.productStatus).toEqual(selectedProduct.productStatus)

  // ADD THE SELECTED PRODUCT TO THE CART

  // Select a random product color
  const selectedColor = singleProductResponse.colors[Math.floor(Math.random() * singleProductResponse.colors.length)]
  const addToCartResponse = await requestHandler
      .path(`/order/api/v1/carts/${USER_ID}/product/${selectedProduct.productId}/color/${selectedColor.code}?quantity=1`)
      .headers({Authorization: BASIC_AUTHORIZATION})
      .postRequest(201)
  await expect(addToCartResponse).isMatchingSchema("POST_add_to_cart_schema.json")
  expect(addToCartResponse.userId).toEqual(Number(USER_ID))
  // In the response's "productsInCart" list, find the product which was added to the cart and assert its' properties
  const productInCart = addToCartResponse.productsInCart.find((product: any) => product.productId === selectedProduct.productId)
  expect(productInCart.productName).toEqual(selectedProduct.productName)
  expect(productInCart.price).toEqual(selectedProduct.price)
  expect(productInCart.quantity).toEqual(1)

  // CHECKOUT

  // const shippingCostBody = getShippingCostPayload()
  // const shippingCostResponse = await requestHandler
  //   .path("/order/api/v1/shippingcost/")
  //   .body(shippingCostBody)
  //   .postRequest(200)
  // await expect(shippingCostResponse).isMatchingSchema("POST_shipping_cost_schema.json")
  // expect(shippingCostResponse.transactionDate).toEqual(getTodaysDate())

  // COMPLETE ORDER

  const orderBody = getOrderPayload(selectedProduct.price, selectedProduct.productId, selectedColor.code)
  const orderResponse = await requestHandler
    .path(`/order/api/v1/orders/users/${USER_ID}`)
    .headers({Authorization: BASIC_AUTHORIZATION})
    .body(orderBody)
    .postRequest(200)
  await expect(orderResponse).isMatchingSchema("POST_order_schema.json")

  // DELETE ITEMS FROM SHOPPING CART

  const deleteItemsFromShoppingCartResponse = await requestHandler
    .path(`/order/api/v1/carts/${USER_ID}`)
    .headers({Authorization: BASIC_AUTHORIZATION})
    .deleteRequest(200)
  await expect(deleteItemsFromShoppingCartResponse).isMatchingSchema("DELETE_items_from_shopping_cart.json")
  expect(deleteItemsFromShoppingCartResponse.userId).toEqual(Number(USER_ID))
  expect(deleteItemsFromShoppingCartResponse.productsInCart).toHaveLength(0)

})

test("POST contact us", async ({ requestHandler }) => {
  const body = getRandomContactUsEmail()
  const response = await requestHandler.path("/catalog/api/v1/support/contact_us/email").body(body).postRequest(200)
  await expect(response).isMatchingSchema("POST_support_contact_us_email_schema.json")
  expect(response.success).toEqual(true)
  expect(response.reason).toEqual("Thank you for contacting Advantage support.")
  expect(response.returnCode).toEqual(1)
})
