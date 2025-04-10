import { describe, expect, it, beforeEach } from "vitest";
import {
  addProduct,
  removeProduct,
  getProductCount,
  getTotal,
  applyDiscount,
  resetCart,
} from "../src/cart";
import { Product } from "../src/cart";
import { z } from "zod";

const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number().positive(),
  quantity: z.number().int().positive(),
});

describe("cart module", () => {

  beforeEach(() => {
    resetCart();
  });

  it("should add a product to the cart", () => {
    const product: Product = {
      id: "1",
      name: "T-shirt",
      price: 20,
      quantity: 2,
    };
    addProduct(product);
    expect(getProductCount()).toBe(2);
  });

  it("should increase quantity if product already exists", () => {
    const product: Product = { id: "1", name: "T-shirt", price: 20, quantity: 1 };
    addProduct(product);
    addProduct(product);
    expect(getProductCount()).toBe(2);
  });

  it("should remove a product from the cart", () => {
    const product: Product = { id: "1", name: "T-shirt", price: 20, quantity: 1 };
    addProduct(product);
    removeProduct("1");
    expect(getProductCount()).toBe(0);
  });

  it("should do nothing if removing a non-existent product", () => {
    removeProduct("not-found");
    expect(getProductCount()).toBe(0);
  });

  it("should return the number of items in the cart", () => {
    const p1 = { id: "1", name: "Item 1", price: 10, quantity: 2 };
    const p2 = { id: "2", name: "Item 2", price: 15, quantity: 3 };
    addProduct(p1);
    addProduct(p2);
    expect(getProductCount()).toBe(5);
  });

  it("should return the total price", () => {
    const p1 = { id: "1", name: "Item 1", price: 10, quantity: 2 };
    const p2 = { id: "2", name: "Item 2", price: 15, quantity: 1 };
    addProduct(p1);
    addProduct(p2);
    expect(getTotal()).toBe(35);
  });

  it("should apply a valid discount code", () => {
    const product = { id: "1", name: "Item", price: 100, quantity: 1 };
    addProduct(product);
    applyDiscount("PROMO10");
    expect(getTotal()).toBe(90);
  });

  it("should ignore an invalid discount code", () => {
    const product = { id: "1", name: "Item", price: 100, quantity: 1 };
    addProduct(product);
    expect(() => applyDiscount("INVALIDE")).toThrow("Code promo invalide");
    expect(getTotal()).toBe(100);
  });

  it("should reject invalid product data", () => {
    const badProduct = { id: "1", name: "Bad", price: -5, quantity: 0 };
    expect(() => ProductSchema.parse(badProduct)).toThrow();
  });
});
