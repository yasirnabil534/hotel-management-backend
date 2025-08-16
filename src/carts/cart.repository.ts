import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ICartRepository } from './cart.interface';
import { Cart, CartItem } from '@prisma/client';

@Injectable()
export class CartRepository implements ICartRepository {
  constructor(private prisma: PrismaService) {}

  async create(userId: string): Promise<Cart> {
    try {
      return this.prisma.cart.create({
        data: { userId }
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

  async findByUser(userId: string): Promise<Cart & { CartItem: CartItem[] }> {
    try {
      return this.prisma.cart.findFirst({
        where: { userId },
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