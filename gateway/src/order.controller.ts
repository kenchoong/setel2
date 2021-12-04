import {
  Controller,
  Post,
  Put,
  Get,
  Body,
  Req,
  Inject,
  HttpStatus,
  HttpException,
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
  }

  @Get('/status/:orderId/:userId')
  public async checkStatus() {
    // here check status
  }

  @Get(':userId')
  public async listOrder(@Param('userId') userId: string) {
    // here get order stuff
  }

  @Get('/:userId/:orderId')
  public async findOrderByOrderId(
    @Param('orderId') orderId: string,
    @Param('userId') userId: string,
  ) {
    // here get order stuff
  }

  @Put(':orderId')
  public async updateOrder(
    @Param('orderId') orderId: string,
    @Body() body: UpdateOrderDto,
  ) {
    // here get order stuff
  }
}
