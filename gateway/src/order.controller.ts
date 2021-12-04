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

@Controller('orders')
export class OrderController {
  constructor(
    @Inject('ORDER_SERVICE')
    private readonly orderServiceClient: ClientProxy,
    @Inject('PAYMENT_SERVICE')
    private readonly paymentServiceClient: ClientProxy,
  ) {}

  @Post()
  public async createOrder() {
    // here get order stuff
  }

  @Get()
  public async getOrder() {
    // here get order stuff
  }

  @Put()
  public async updateOrder() {
    // here get order stuff
  }

  @Get()
  public async getAllOrder() {
    // here get order stuff
  }
}
