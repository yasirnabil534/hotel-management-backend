import { Body, Controller, Delete, Get, Inject, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AddCartItemDto, UpdateCartItemDto } from './cart.dto';
import { ICartService } from './cart.interface';

@ApiTags('Carts')
@ApiBearerAuth()
@Controller('carts')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(
    @Inject('ICartService')
    private readonly cartService: ICartService
  ) {}

  @Get('/user/:userId')
  @ApiOperation({ summary: 'Get user cart', description: 'Retrieve the cart for a specific user' })
  @ApiParam({ name: 'userId', description: 'User ID to get cart for', type: 'string' })
  @ApiResponse({ status: 200, description: 'Cart retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Cart not found' })
  async getCart(@Param('userId') userId: string) {
    try {
      return this.cartService.getCartByUser(userId);
    } catch (error) {
      throw error;
    }
  }

  @Post('/item/:id')
  @ApiOperation({ summary: 'Add item to cart', description: 'Add a product item to user cart' })
  @ApiParam({ name: 'id', description: 'User ID to add item to cart', type: 'string' })
  @ApiBody({ type: AddCartItemDto, description: 'Cart item details to add' })
  @ApiResponse({ status: 201, description: 'Item added to cart successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Product or cart not found' })
  async addItem(@Param('id') id: string, @Body() addCartItemDto: AddCartItemDto) {
    try {
      return this.cartService.addItem(id, addCartItemDto.productId, addCartItemDto.quantity);
    } catch (error) {
      throw error;
    }
  }

  @Put('items/:id')
  @ApiOperation({ summary: 'Update cart item quantity', description: 'Update the quantity of an item in the cart' })
  @ApiParam({ name: 'id', description: 'Cart item ID to update', type: 'string' })
  @ApiBody({ type: UpdateCartItemDto, description: 'New quantity for the cart item' })
  @ApiResponse({ status: 200, description: 'Cart item quantity updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Cart item not found' })
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
  @ApiOperation({ summary: 'Remove item from cart', description: 'Remove a specific item from the cart' })
  @ApiParam({ name: 'id', description: 'Cart item ID to remove', type: 'string' })
  @ApiResponse({ status: 200, description: 'Item removed from cart successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Cart item not found' })
  async removeItem(@Param('id') itemId: string) {
    try {
      return this.cartService.removeItem(itemId);
    } catch (error) {
      throw error;
    }
  }

  @Post('/checkout/:userId')
  @ApiOperation({ summary: 'Checkout cart', description: 'Process checkout for user cart and create order' })
  @ApiParam({ name: 'userId', description: 'User ID to checkout cart for', type: 'string' })
  @ApiResponse({ status: 201, description: 'Checkout completed successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - cart is empty or invalid' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Cart not found' })
  async checkout(@Param('userId') userId: string) {
    try {
      return this.cartService.checkout(userId);
    } catch (error) {
      throw error;
    }
  }

  @Delete('/clear/:userId')
  @ApiOperation({ summary: 'Clear cart', description: 'Remove all items from user cart' })
  @ApiParam({ name: 'userId', description: 'User ID to clear cart for', type: 'string' })
  @ApiResponse({ status: 200, description: 'Cart cleared successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Cart not found' })
  async clearCart(@Param('userId') userId: string) {
    try {
      return this.cartService.clearCart(userId);
    } catch (error) {
      throw error;
    }
  }
}