import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Logger,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Request,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FastifyReply } from 'fastify';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { QueryProcessorInterceptor } from '../common/query-processor.interceptor';
import {
  CreateOrderDto,
  UpdateOrderDto,
  UpdateOrderStatusDto,
} from './order.dto';
import { IOrderService } from './order.interface';
import {
  ALL_ORDER_STATUSES,
  ORDER_STATUS_FLOW,
  ORDER_STATUS_OPTIONS,
} from './order-status.enum';

const ADMIN_ROLES = ['super-admin', 'admin', 'hotel-management', 'hotel-staff'];

@ApiTags('Orders API')
@Controller('/orders')
export class OrderController {
  private readonly logger = new Logger(OrderController.name);

  constructor(
    @Inject('IOrderService')
    private readonly orderService: IOrderService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({
    status: 201,
    description: 'The order has been successfully created.',
  })
  async create(
    @Body() createOrderDto: CreateOrderDto,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    try {
      const order = await this.orderService.create(createOrderDto);
      reply.code(201).send({
        statusCode: 201,
        statusMessage: 'Success',
        data: order,
      });
    } catch (error) {
      this.logger.error(`Error creating order: ${error.message}`, error.stack);
      reply.code(error.status || 500).send({
        statusCode: error.status || 500,
        statusMessage: 'Failed',
        error: error.message,
      });
    }
  }

  @Get('/tracking/statuses')
  @ApiOperation({ summary: 'Get order tracking statuses' })
  async getTrackingStatuses(@Res() reply: FastifyReply): Promise<void> {
    reply.code(200).send({
      statusCode: 200,
      statusMessage: 'Success',
      data: ORDER_STATUS_OPTIONS,
    });
  }

  @Get('/tracking/me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Get order tracking for the authenticated customer or room',
  })
  async findMyTrackingOrders(
    @Request() req,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    try {
      const orders =
        req.user.type === 'room'
          ? await this.orderService.findByRoom(req.user.userId)
          : await this.orderService.findByUser(req.user.userId);

      reply.code(200).send({
        statusCode: 200,
        statusMessage: 'Success',
        data: orders,
      });
    } catch (error) {
      this.logger.error(
        `Error fetching my order tracking: ${error.message}`,
        error.stack,
      );
      reply.code(error.status || 500).send({
        statusCode: error.status || 500,
        statusMessage: 'Failed',
        error: error.message,
      });
    }
  }

  @Get('/tracking/hotel/:hotelId')
  @ApiOperation({ summary: 'Get order tracking by hotel ID for admin views' })
  async findHotelTrackingOrders(
    @Param('hotelId') hotelId: string,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    try {
      const orders = await this.orderService.findByHotel(hotelId);
      reply.code(200).send({
        statusCode: 200,
        statusMessage: 'Success',
        data: orders,
      });
    } catch (error) {
      this.logger.error(
        `Error fetching hotel order tracking: ${error.message}`,
        error.stack,
      );
      reply.code(error.status || 500).send({
        statusCode: error.status || 500,
        statusMessage: 'Failed',
        error: error.message,
      });
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all orders' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number for pagination',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search term for filtering orders',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    type: String,
    description: 'Field to sort by',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    enum: ['asc', 'desc'],
    description: 'Sort order (ascending or descending)',
  })
  @ApiQuery({
    name: 'hidden',
    required: false,
    type: Boolean,
    description: 'Include hidden orders (default: false)',
  })
  @ApiQuery({
    name: 'hotelId',
    required: false,
    type: String,
    description: 'Filter orders by hotel ID',
  })
  @ApiQuery({
    name: 'customerId',
    required: false,
    type: String,
    description: 'Filter orders by customer ID (userId)',
  })
  @ApiQuery({
    name: 'roomId',
    required: false,
    type: String,
    description: 'Filter orders by room ID',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    type: String,
    description: 'Filter orders by tracking status. Can be one of ALL_ORDER_STATUSES, or "active" (pending, received, in_progress), "canceled_by_admin", "canceled_by_customer".',
  })
  @UseInterceptors(QueryProcessorInterceptor)
  async findAll(
    @Query() query: Record<string, any>,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    try {
      const orders = await this.orderService.findAll(query);
      reply.code(200).send({
        statusCode: 200,
        statusMessage: 'Success',
        data: orders,
      });
    } catch (error) {
      this.logger.error(`Error fetching orders: ${error.message}`, error.stack);
      reply.code(error.status || 500).send({
        statusCode: error.status || 500,
        statusMessage: 'Failed',
        error: error.message,
      });
    }
  }

  @Get('/hotel/:hotelId')
  @ApiOperation({ summary: 'Get orders by hotel ID' })
  async findByHotel(
    @Param('hotelId') hotelId: string,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    try {
      const orders = await this.orderService.findByHotel(hotelId);
      reply.code(200).send({
        statusCode: 200,
        statusMessage: 'Success',
        data: orders,
      });
    } catch (error) {
      this.logger.error(
        `Error fetching orders by hotel: ${error.message}`,
        error.stack,
      );
      reply.code(error.status || 500).send({
        statusCode: error.status || 500,
        statusMessage: 'Failed',
        error: error.message,
      });
    }
  }

  @Get('/customer/:customerId')
  @ApiOperation({ summary: 'Get orders by customer ID' })
  async findByCustomer(
    @Param('customerId') customerId: string,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    try {
      const orders = await this.orderService.findByUser(customerId);
      reply.code(200).send({
        statusCode: 200,
        statusMessage: 'Success',
        data: orders,
      });
    } catch (error) {
      this.logger.error(
        `Error fetching orders by customer: ${error.message}`,
        error.stack,
      );
      reply.code(error.status || 500).send({
        statusCode: error.status || 500,
        statusMessage: 'Failed',
        error: error.message,
      });
    }
  }

  @Get('/room/:roomId')
  @ApiOperation({ summary: 'Get orders by room ID' })
  async findByRoom(
    @Param('roomId') roomId: string,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    try {
      const orders = await this.orderService.findByRoom(roomId);
      reply.code(200).send({
        statusCode: 200,
        statusMessage: 'Success',
        data: orders,
      });
    } catch (error) {
      this.logger.error(
        `Error fetching orders by room: ${error.message}`,
        error.stack,
      );
      reply.code(error.status || 500).send({
        statusCode: error.status || 500,
        statusMessage: 'Failed',
        error: error.message,
      });
    }
  }

  @Get('/hotel/:hotelId/customer/:customerId')
  @ApiOperation({ summary: 'Get orders by hotel and customer ID' })
  async findByHotelAndCustomer(
    @Param('hotelId') hotelId: string,
    @Param('customerId') customerId: string,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    try {
      const orders = await this.orderService.findByHotelAndUser(
        hotelId,
        customerId,
      );
      reply.code(200).send({
        statusCode: 200,
        statusMessage: 'Success',
        data: orders,
      });
    } catch (error) {
      this.logger.error(
        `Error fetching orders by hotel and customer: ${error.message}`,
        error.stack,
      );
      reply.code(error.status || 500).send({
        statusCode: error.status || 500,
        statusMessage: 'Failed',
        error: error.message,
      });
    }
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get an order by id' })
  async findOne(
    @Param('id') id: string,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    try {
      const order = await this.orderService.findOne(id);
      reply.code(200).send({
        statusCode: 200,
        statusMessage: 'Success',
        data: order,
      });
    } catch (error) {
      this.logger.error(`Error fetching order: ${error.message}`, error.stack);
      reply.code(error.status || 500).send({
        statusCode: error.status || 500,
        statusMessage: 'Failed',
        error: error.message,
      });
    }
  }

  // ── Admin-only endpoints ──────────────────────────────────────────────

  @Put('/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...ADMIN_ROLES)
  @ApiOperation({ summary: 'Update an order (admin only)' })
  async update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    try {
      const order = await this.orderService.update(id, updateOrderDto);
      reply.code(200).send({
        statusCode: 200,
        statusMessage: 'Success',
        data: order,
      });
    } catch (error) {
      this.logger.error(`Error updating order: ${error.message}`, error.stack);
      reply.code(error.status || 500).send({
        statusCode: error.status || 500,
        statusMessage: 'Failed',
        error: error.message,
      });
    }
  }

  @Patch('/:id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...ADMIN_ROLES)
  @ApiOperation({ summary: 'Update an order tracking status (admin only)' })
  async updateStatus(
    @Param('id') id: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    try {
      const order = await this.orderService.updateStatus(
        id,
        updateOrderStatusDto.status,
      );
      reply.code(200).send({
        statusCode: 200,
        statusMessage: 'Success',
        data: order,
      });
    } catch (error) {
      this.logger.error(
        `Error updating order status: ${error.message}`,
        error.stack,
      );
      reply.code(error.status || 500).send({
        statusCode: error.status || 500,
        statusMessage: 'Failed',
        error: error.message,
      });
    }
  }

  // ── Cancel endpoint (both admin and customer/room) ────────────────────

  @Patch('/:id/cancel')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Cancel an order (available to both admin and customer before done status)',
  })
  async cancelOrder(
    @Request() req,
    @Param('id') id: string,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    try {
      const cancelledBy = req.user.type === 'human' ? 'admin' : 'customer';
      const order = await this.orderService.cancelOrder(id, cancelledBy);
      reply.code(200).send({
        statusCode: 200,
        statusMessage: 'Success',
        data: order,
      });
    } catch (error) {
      this.logger.error(
        `Error cancelling order: ${error.message}`,
        error.stack,
      );
      reply.code(error.status || 500).send({
        statusCode: error.status || 500,
        statusMessage: 'Failed',
        error: error.message,
      });
    }
  }

  // ── Admin-only endpoint ───────────────────────────────────────────────

  @Delete('/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...ADMIN_ROLES)
  @ApiOperation({ summary: 'Delete an order (admin only)' })
  async remove(
    @Param('id') id: string,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    try {
      await this.orderService.remove(id);
      reply.code(200).send({
        statusCode: 200,
        statusMessage: 'Success',
      });
    } catch (error) {
      this.logger.error(`Error deleting order: ${error.message}`, error.stack);
      reply.code(error.status || 500).send({
        statusCode: error.status || 500,
        statusMessage: 'Failed',
        error: error.message,
      });
    }
  }
}
