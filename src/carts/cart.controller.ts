import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Request, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FastifyReply } from 'fastify';
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

  @Get('/me')
  @ApiOperation({ summary: 'Get my cart', description: 'Retrieve the cart for authenticated user or room' })
  @ApiResponse({ status: 200, description: 'Cart retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Cart not found' })
  async getMyCart(@Request() req, @Res() reply: FastifyReply) {
    try {
      const entityId = req.user.userId;
      const entityType = req.user.type; // 'human' or 'room'
      
      const cart = await this.cartService.getCartByEntity(entityId, entityType);
      reply.send({
        statusCode: 200,
        statusMessage: 'Success',
        data: cart,
      });
    } catch (error) {
      reply.code(error.status || 500).send({
        statusCode: error.status || 500,
        statusMessage: 'Failed',
        error: error.message,
      });
    }
  }

  @Get('/user/:userId')
  @ApiOperation({ summary: 'Get user cart', description: 'Retrieve the cart for a specific user (admin only)' })
  @ApiParam({ name: 'userId', description: 'User ID to get cart for', type: 'string' })
  @ApiResponse({ status: 200, description: 'Cart retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Cart not found' })
  async getCart(@Param('userId') userId: string, @Res() reply: FastifyReply) {
    try {
      const cart = await this.cartService.getCartByEntity(userId, 'human');
      reply.send({
        statusCode: 200,
        statusMessage: 'Success',
        data: cart,
      });
    } catch (error) {
      reply.code(error.status || 500).send({
        statusCode: error.status || 500,
        statusMessage: 'Failed',
        error: error.message,
      });
    }
  }

  @Get('/room/:roomId')
  @ApiOperation({ summary: 'Get room cart', description: 'Retrieve the cart for a specific room (admin only)' })
  @ApiParam({ name: 'roomId', description: 'Room ID to get cart for', type: 'string' })
  @ApiResponse({ status: 200, description: 'Cart retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Cart not found' })
  async getRoomCart(@Param('roomId') roomId: string, @Res() reply: FastifyReply) {
    try {
      const cart = await this.cartService.getCartByEntity(roomId, 'room');
      reply.send({
        statusCode: 200,
        statusMessage: 'Success',
        data: cart,
      });
    } catch (error) {
      reply.code(error.status || 500).send({
        statusCode: error.status || 500,
        statusMessage: 'Failed',
        error: error.message,
      });
    }
  }

  @Post('/item')
  @ApiOperation({ summary: 'Add item to my cart', description: 'Add a product item to authenticated user/room cart' })
  @ApiBody({ type: AddCartItemDto, description: 'Cart item details to add' })
  @ApiResponse({ status: 201, description: 'Item added to cart successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Product or cart not found' })
  async addItem(@Request() req, @Body() addCartItemDto: AddCartItemDto, @Res() reply: FastifyReply) {
    try {
      const entityId = req.user.userId;
      const entityType = req.user.type;
      
      const result = await this.cartService.addItem(entityId, entityType, addCartItemDto.productId, addCartItemDto.quantity);
      reply.code(201).send({
        statusCode: 201,
        statusMessage: 'Success',
        data: result,
      });
    } catch (error) {
      reply.code(error.status || 500).send({
        statusCode: error.status || 500,
        statusMessage: 'Failed',
        error: error.message,
      });
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
    @Res() reply: FastifyReply
  ) {
    try {
      const result = await this.cartService.updateItemQuantity(itemId, updateCartItemDto.quantity);
      reply.send({
        statusCode: 200,
        statusMessage: 'Success',
        data: result,
      });
    } catch (error) {
      reply.code(error.status || 500).send({
        statusCode: error.status || 500,
        statusMessage: 'Failed',
        error: error.message,
      });
    }
  }

  @Delete('items/:id')
  @ApiOperation({ summary: 'Remove item from cart', description: 'Remove a specific item from the cart' })
  @ApiParam({ name: 'id', description: 'Cart item ID to remove', type: 'string' })
  @ApiResponse({ status: 200, description: 'Item removed from cart successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Cart item not found' })
  async removeItem(@Param('id') itemId: string, @Res() reply: FastifyReply) {
    try {
      const result = await this.cartService.removeItem(itemId);
      reply.send({
        statusCode: 200,
        statusMessage: 'Success',
        data: result,
      });
    } catch (error) {
      reply.code(error.status || 500).send({
        statusCode: error.status || 500,
        statusMessage: 'Failed',
        error: error.message,
      });
    }
  }

  @Post('/checkout')
  @ApiOperation({ summary: 'Checkout my cart', description: 'Process checkout for authenticated user/room cart and create order' })
  @ApiResponse({ status: 201, description: 'Checkout completed successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - cart is empty or invalid' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Cart not found' })
  async checkout(@Request() req, @Res() reply: FastifyReply) {
    try {
      const entityId = req.user.userId;
      const entityType = req.user.type;
      
      const result = await this.cartService.checkout(entityId, entityType);
      reply.code(201).send({
        statusCode: 201,
        statusMessage: 'Success',
        data: result,
      });
    } catch (error) {
      reply.code(error.status || 500).send({
        statusCode: error.status || 500,
        statusMessage: 'Failed',
        error: error.message,
      });
    }
  }

  @Delete('/clear')
  @ApiOperation({ summary: 'Clear my cart', description: 'Remove all items from authenticated user/room cart' })
  @ApiResponse({ status: 200, description: 'Cart cleared successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Cart not found' })
  async clearCart(@Request() req, @Res() reply: FastifyReply) {
    try {
      const entityId = req.user.userId;
      const entityType = req.user.type;
      
      const result = await this.cartService.clearCart(entityId, entityType);
      reply.send({
        statusCode: 200,
        statusMessage: 'Success',
        data: result,
      });
    } catch (error) {
      reply.code(error.status || 500).send({
        statusCode: error.status || 500,
        statusMessage: 'Failed',
        error: error.message,
      });
    }
  }
}