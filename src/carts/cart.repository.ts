import { Injectable } from '@nestjs/common';
import { Cart, CartItem } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ICartRepository } from './cart.interface';

@Injectable()
export class CartRepository implements ICartRepository {
  constructor(private prisma: PrismaService) {}

  async create(entityId: string, entityType: 'human' | 'room'): Promise<Cart> {
    try {
      const data: any = {};
      if (entityType === 'room') {
        data.roomId = entityId;
      } else {
        data.userId = entityId;
      }
      
      return this.prisma.cart.create({
        data
      });
    } catch (error) {
      throw error;
    }
  }

  async findById(id: string): Promise<Cart & { CartItem: CartItem[] }> {
    try {
      return this.prisma.cart.findUnique({
        where: { id },
        include: {
          CartItem: {
            include: { product: true }
          }
        }
      });
    } catch (error) {
      throw error;
    }
  }

  async findByEntity(entityId: string, entityType: 'human' | 'room'): Promise<Cart & { CartItem: CartItem[] }> {
    try {
      const where: any = {};
      if (entityType === 'room') {
        where.roomId = entityId;
      } else {
        where.userId = entityId;
      }

      return this.prisma.cart.findFirst({
        where,
        include: {
          CartItem: {
            include: { product: true }
          }
        }
      });
    } catch (error) {
      throw error;
    }
  }

  async findByUser(userId: string): Promise<Cart & { CartItem: CartItem[] }> {
    return this.findByEntity(userId, 'human');
  }

  async addItem(cartId: string, productId: string, quantity: number, price: number): Promise<CartItem> {
    try {
      return this.prisma.cartItem.create({
        data: {
          cartId,
          productId,
          quantity,
          price
        }
      });
    } catch (error) {
      throw error;
    }
  }

  async updateItemQuantity(itemId: string, quantity: number): Promise<CartItem> {
    try {
      return this.prisma.cartItem.update({
        where: { id: itemId },
        data: { quantity }
      });
    } catch (error) {
      throw error;
    }
  }

  async removeItem(itemId: string): Promise<CartItem> {
    try {
      return this.prisma.cartItem.delete({
        where: { id: itemId }
      });
    } catch (error) {
      throw error;
    }
  }

  async clear(cartId: string): Promise<Cart> {
    try {
      await this.prisma.cartItem.deleteMany({
        where: { cartId }
      });
      return this.prisma.cart.findUnique({
        where: { id: cartId }
      });
    } catch (error) {
      throw error;
    }
  }
}