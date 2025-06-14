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
    return this.cartService.getCartByUser(userId);
  }

  @Post('/item/:id')
  async addItem(@Param('id') id: string, @Body() addCartItemDto: AddCartItemDto) {
    return this.cartService.addItem(id, addCartItemDto.productId, addCartItemDto.quantity);
  }

  @Put('items/:id')
  async updateItemQuantity(
    @Param('id') itemId: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    return this.cartService.updateItemQuantity(itemId, updateCartItemDto.quantity);
  }

  @Delete('items/:id')
  async removeItem(@Param('id') itemId: string) {
    return this.cartService.removeItem(itemId);
  }

  @Post('/checkout/:userId')
  async checkout(@Param() userId: string) {
    return this.cartService.checkout(userId);
  }

  @Delete('/clear/:userId')
  async clearCart(@Param() userId: string) {
    return this.cartService.clearCart(userId);
  }
}