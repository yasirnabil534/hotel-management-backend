import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ICartRepository, ICartService } from './cart.interface';
import { Cart, CartItem } from '@prisma/client';
import { IOrderService } from '../orders/order.interface';

@Injectable()
export class CartService implements ICartService {
  constructor(
    @Inject('ICartRepository')
    private readonly cartRepository: ICartRepository,
    @Inject('IOrderService')
    private readonly orderService: IOrderService
  ) {}

  async getCartByUser(userId: string): Promise<Cart & { CartItem: CartItem[] }> {
    try {
      let cart: any = await this.cartRepository.findByUser(userId);
      if (!cart) {
        cart = await this.cartRepository.create(userId);
      }
      return cart;
    } catch (error) {
      throw error;
    }
  }

  async getCartById(cartId: string): Promise<Cart & { CartItem: CartItem[] }> {
    try {
      const cart = await this.cartRepository.findById(cartId);
      if (!cart) {
        throw new NotFoundException(`Cart ${cartId} not found`);
      }
      return cart;
    } catch (error) {
      throw error;
    }
  }

  async addItem(id: string, productId: string, quantity: number): Promise<CartItem> {
    try {
      const cart = await this.getCartById(id);
      const existingItem = cart.CartItem.find(item => item.productId === productId);

      if (existingItem) {
        return this.updateItemQuantity(existingItem.id, existingItem.quantity + quantity);
      }

      // Get product price from product service or repository
      const price = 0; // TODO: Get actual product price
      return this.cartRepository.addItem(cart.id, productId, quantity, price);
    } catch (error) {
      throw error;
    }
  }

  async updateItemQuantity(itemId: string, quantity: number): Promise<CartItem> {
    try {
      if (quantity === 0) {
        return this.removeItem(itemId);
      }

      return this.cartRepository.updateItemQuantity(itemId, quantity);
    } catch (error) {
      throw error;
    }
  }

  async removeItem(itemId: string): Promise<CartItem> {
    try {
      return this.cartRepository.removeItem(itemId);
    } catch (error) {
      throw error;
    }
  }

  async clearCart(id: string): Promise<Cart> {
    try {
      return this.cartRepository.clear(id);
    } catch (error) {
      throw error;
    }
  }

  async checkout(id: string): Promise<void> {
    try {
      const cart = await this.getCartById(id);
      
      if (cart.CartItem.length === 0) {
        throw new Error('Cart is empty');
      }

      // Create order from cart items
      await this.orderService.create({
        userId: cart.userId,
        hotelId: (cart.CartItem[0] as any).product.hotelId, // Assuming all items are from the same hotel
        orderProducts: cart.CartItem.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price
        })),
        status: 'PENDING',
        total: cart.CartItem.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      });

      // Clear the cart after successful order creation
      await this.clearCart(id);
    } catch (error) {
      throw error;
    }
  }
}