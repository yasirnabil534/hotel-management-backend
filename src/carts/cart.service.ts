import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Cart, CartItem } from '@prisma/client';
import { IOrderService } from '../orders/order.interface';
import { ICartRepository, ICartService } from './cart.interface';

@Injectable()
export class CartService implements ICartService {
  constructor(
    @Inject('ICartRepository')
    private readonly cartRepository: ICartRepository,
    @Inject('IOrderService')
    private readonly orderService: IOrderService
  ) {}

  async getCartByEntity(entityId: string, entityType: 'human' | 'room'): Promise<Cart & { CartItem: CartItem[] }> {
    try {
      let cart: any = await this.cartRepository.findByEntity(entityId, entityType);
      if (!cart) {
        cart = await this.cartRepository.create(entityId, entityType);
      }
      return cart;
    } catch (error) {
      throw error;
    }
  }

  async getCartByUser(userId: string): Promise<Cart & { CartItem: CartItem[] }> {
    return this.getCartByEntity(userId, 'human');
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

  async addItem(entityId: string, entityType: 'human' | 'room', productId: string, quantity: number): Promise<CartItem> {
    try {
      const cart = await this.getCartByEntity(entityId, entityType);
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

  async clearCart(entityId: string, entityType: 'human' | 'room'): Promise<Cart> {
    try {
      const cart = await this.getCartByEntity(entityId, entityType);
      return this.cartRepository.clear(cart.id);
    } catch (error) {
      throw error;
    }
  }

  async checkout(entityId: string, entityType: 'human' | 'room'): Promise<any> {
    try {
      const cart = await this.getCartByEntity(entityId, entityType);
      
      if (cart.CartItem.length === 0) {
        throw new Error('Cart is empty');
      }

      // Create order from cart items
      const orderData: any = {
        hotelId: (cart.CartItem[0] as any).product.hotelId, // Assuming all items are from the same hotel
        orderProducts: cart.CartItem.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price
        })),
        status: 'pending',
        total: cart.CartItem.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      };

      // Set userId or roomId based on entity type
      if (entityType === 'room') {
        orderData.roomId = entityId;
      } else {
        orderData.userId = entityId;
      }

      const order = await this.orderService.create(orderData);

      // Clear the cart after successful order creation
      await this.cartRepository.clear(cart.id);

      return order;
    } catch (error) {
      throw error;
    }
  }
}