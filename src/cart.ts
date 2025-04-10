import { z } from "zod";

export type Product = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number().nonnegative(),
  quantity: z.number().int().positive(),
});

let cart: Product[] = [];
let discount = 0;

/**
 * Adds a product to the cart. If the product already exists in the cart,
 * its quantity is updated by adding the quantity of the provided product.
 * If the product does not exist, it is added to the cart.
 *
 * @param product - The product to be added to the cart. It must conform to the `Product` schema.
 * @throws Will throw an error if the provided product does not match the `ProductSchema`.
 */
const addProduct = (product: Product): void => {
  ProductSchema.parse(product);

  const poductExisting = cart.find((p) => p.id === product.id);
  if (poductExisting) {
    poductExisting.quantity += product.quantity;
  } else {
    cart.push({ ...product });
  }
};

/**
 * Removes a product from the cart based on the provided product ID.
 *
 * @param productId - The unique identifier of the product to be removed.
 * @throws Will throw an error if `cart` is not defined or is not an array.
 */
const removeProduct = (productId: string): void => {
  cart = cart.filter((p) => p.id !== productId);
};

/**
 * Calculates the total number of products in the cart by summing up the quantities of all items.
 *
 * @returns The total count of products in the cart.
 */
const getProductCount = (): number => {
  return cart.reduce((acc, p) => acc + p.quantity, 0);
};

/**
 * Calculates the total cost of items in the cart after applying a discount.
 *
 * @returns {number} The total cost after applying the discount.
 *
 * @remarks
 * This function assumes the existence of a `cart` array where each item has
 * `price` and `quantity` properties. It also assumes the existence of a
 * `discount` variable representing the discount rate as a decimal (e.g., 0.2 for 20%).
 *
 * @example
 * // Assuming the following cart and discount:
 * // const cart = [{ price: 10, quantity: 2 }, { price: 5, quantity: 1 }];
 * // const discount = 0.1; // 10% discount
 * const total = getTotal();
 * console.log(total); // Logs the total cost after discount
 */
const getTotal = (): number => {
  const total = cart.reduce((acc, p) => acc + p.price * p.quantity, 0);
  console.log(`Total before discount: ${total}`);
  
  return total * (1 - discount);
};

/**
 * Applies a discount to the cart based on the provided discount code.
 *
 * @param code - The discount code to apply. Currently supports "PROMO10" for a 10% discount.
 * @throws {Error} Throws an error if the discount code is invalid.
 */
const applyDiscount = (code: string): void => {
  if (code === "PROMO10") {
    discount = 0.1;
  } else {
    throw new Error("Code promo invalide");
  }
};

/**
 * Resets the cart to its initial state by clearing all items and resetting the discount to zero.
 *
 * @returns {void} This function does not return a value.
 */
const resetCart = (): void => {
  cart = [];
  discount = 0;
};

export {
  addProduct,
  removeProduct,
  getProductCount,
  getTotal,
  applyDiscount,
  resetCart,
};
