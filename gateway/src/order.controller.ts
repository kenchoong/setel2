import {
  Controller,
  Post,
  Put,
  Get,
  Body,
  Req,
  Inject,
  Param,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { CreateOrderDTO } from './dto/order/CreateOrderDto';
import { UpdateOrderDto } from './dto/order/UpdateOrderDto';

@Controller('orders')
export class OrderController {
  constructor(
    @Inject('ORDER_SERVICE')
    private readonly orderServiceClient: ClientProxy,
  ) {}

  @Post()
  public async createOrder(@Body() body: CreateOrderDTO, @Req() req) {
    // here get order stuff

    // here send the message to order service
    this.orderServiceClient.send('create_order', body);

    // TODO: trigger the payment method
  }

  @Get('/status/:orderId/:userId')
  public async checkStatus(
    @Param('orderId') orderId: string,
    @Param('userId') userId: string,
  ) {
    // here check status
    this.orderServiceClient.send('list_order', {
      orderId: orderId,
      userId: userId,
    });
  }

  @Get(':userId')
  public async listOrder(@Param('userId') userId: string) {
    // here get order stuff
    this.orderServiceClient.send('check_order_status', userId);
  }

  @Get('/:userId/:orderId')
  public async findOrderByOrderId(
    @Param('orderId') orderId: string,
    @Param('userId') userId: string,
  ) {
    // here get order stuff
    this.orderServiceClient.send('find_order_by_id', {
      orderId: orderId,
      userId: userId,
    });
  }

  @Put(':orderId')
  public async updateOrder(
    @Param('orderId') orderId: string,
    @Body() body: UpdateOrderDto,
  ) {
    // here get order stuff
    this.orderServiceClient.send('update_order', {
      orderId: orderId,
      body,
    });
  }
}
