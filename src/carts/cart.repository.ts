import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ICartRepository } from './cart.interface';
import { Cart, CartItem } from '@prisma/client';

@Injectable()
export class CartRepository implements ICartRepository {
  constructor(private prisma: PrismaService) {}

  async create(userId: string): Promise<Cart> {
    return this.prisma.cart.create({
      data: { userId }
    });
  }

  findById(id: string): Promise<Cart & { CartItem: CartItem[] }> {
    return this.prisma.cart.findUnique({
      where: { id },
      include: {
        CartItem: {
          include: { product: true }
        }
      }
    });
  }

  async findByUser(userId: string): Promise<Cart & { CartItem: CartItem[] }> {
    return this.prisma.cart.findFirst({
      where: { userId },
      include: {
        CartItem: {
          include: { product: true }
        }
      }
    });
  }

  async addItem(cartId: string, productId: string, quantity: number, price: number): Promise<CartItem> {
    return this.prisma.cartItem.create({
      data: {
        cartId,
        productId,
        quantity,
        price
      }
    });
  }

  async updateItemQuantity(itemId: string, quantity: number): Promise<CartItem> {
    return this.prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity }
    });
  }

  async removeItem(itemId: string): Promise<CartItem> {
    return this.prisma.cartItem.delete({
      where: { id: itemId }
    });
  }

  async clear(cartId: string): Promise<Cart> {
    await this.prisma.cartItem.deleteMany({
      where: { cartId }
    });
    return this.prisma.cart.findUnique({
      where: { id: cartId }
    });
  }
}