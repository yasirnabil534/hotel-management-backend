import { Cart, CartItem } from '@prisma/client';

export interface ICartRepository {
  create(userId: string): Promise<Cart>;
  findByUser(userId: string): Promise<Cart & { CartItem: CartItem[] }>;
  findById(id: string): Promise<Cart & { CartItem: CartItem[] }>;
  addItem(cartId: string, productId: string, quantity: number, price: number): Promise<CartItem>;
  updateItemQuantity(itemId: string, quantity: number): Promise<CartItem>;
  removeItem(itemId: string): Promise<CartItem>;
  clear(cartId: string): Promise<Cart>;
}

export interface ICartService {
  getCartByUser(userId: string): Promise<Cart & { CartItem: CartItem[] }>;
  getCartById(cartId: string): Promise<Cart & { CartItem: CartItem[] }>;
  addItem(userId: string, productId: string, quantity: number): Promise<CartItem>;
  updateItemQuantity(itemId: string, quantity: number): Promise<CartItem>;
  removeItem(itemId: string): Promise<CartItem>;
  clearCart(id: string): Promise<Cart>;
  checkout(id: string): Promise<void>;
}