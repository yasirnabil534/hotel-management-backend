import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Inject } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ICartService } from './cart.interface';
import { AddCartItemDto, UpdateCartItemDto } from './cart.dto';

@Controller('carts')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(
    @Inject('ICartService')
    private readonly cartService: ICartService
  ) {}

  @Get('/user/:userId')
  async getCart(@Param() userId: string) {
    try {
      return this.cartService.getCartByUser(userId);
    } catch (error) {
      throw error;
    }
  }

  @Post('/item/:id')
  async addItem(@Param('id') id: string, @Body() addCartItemDto: AddCartItemDto) {
    try {
      return this.cartService.addItem(id, addCartItemDto.productId, addCartItemDto.quantity);
    } catch (error) {
      throw error;
    }
  }

  @Put('items/:id')
  async updateItemQuantity(
    @Param('id') itemId: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    try {
      return this.cartService.updateItemQuantity(itemId, updateCartItemDto.quantity);
    } catch (error) {
      throw error;
    }
  }

  @Delete('items/:id')
  async removeItem(@Param('id') itemId: string) {
    try {
      return this.cartService.removeItem(itemId);
    } catch (error) {
      throw error;
    }
  }

  @Post('/checkout/:userId')
  async checkout(@Param() userId: string) {
    try {
      return this.cartService.checkout(userId);
    } catch (error) {
      throw error;
    }
  }

  @Delete('/clear/:userId')
  async clearCart(@Param() userId: string) {
    try {
      return this.cartService.clearCart(userId);
    } catch (error) {
      throw error;
    }
  }
}