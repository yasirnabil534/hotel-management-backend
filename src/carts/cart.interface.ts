import { Cart, CartItem } from '@prisma/client';

export interface ICartRepository {
  create(entityId: string, entityType: 'human' | 'room'): Promise<Cart>;
  findByEntity(entityId: string, entityType: 'human' | 'room'): Promise<Cart & { CartItem: CartItem[] }>;
  findByUser(userId: string): Promise<Cart & { CartItem: CartItem[] }>;
  findById(id: string): Promise<Cart & { CartItem: CartItem[] }>;
  addItem(cartId: string, productId: string, quantity: number, price: number): Promise<CartItem>;
  updateItemQuantity(itemId: string, quantity: number): Promise<CartItem>;
  removeItem(itemId: string): Promise<CartItem>;
  clear(cartId: string): Promise<Cart>;
}

export interface ICartService {
  getCartByEntity(entityId: string, entityType: 'human' | 'room'): Promise<Cart & { CartItem: CartItem[] }>;
  getCartByUser(userId: string): Promise<Cart & { CartItem: CartItem[] }>;
  getCartById(cartId: string): Promise<Cart & { CartItem: CartItem[] }>;
  addItem(entityId: string, entityType: 'human' | 'room', productId: string, quantity: number): Promise<CartItem>;
  updateItemQuantity(itemId: string, quantity: number): Promise<CartItem>;
  removeItem(itemId: string): Promise<CartItem>;
  clearCart(entityId: string, entityType: 'human' | 'room'): Promise<Cart>;
  checkout(entityId: string, entityType: 'human' | 'room'): Promise<any>;
}