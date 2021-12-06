import {
  Controller,
  Post,
  Put,
  Get,
  Body,
  Inject,
  Param,
  Query,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import { CreateOrderDTO } from './dto/order/CreateOrderDto';
import { UpdateOrderDto } from './dto/order/UpdateOrderDto';

import { ICreateOrderResponse } from './serviceResponseType/ICreateOrderResponse';
import { IGetOrderResponse } from './serviceResponseType/IGetOrderResponse';
import { ICheckOrderResponse } from './serviceResponseType/ICheckOrderResponse';
import { ICreateOrderReturnType } from './endpointReturnType/ICreateOrderReturnType';
import { ICheckOrderReturnType } from './endpointReturnType/ICheckOrderReturnType';
import { IListOrderResponse } from './serviceResponseType/IListOrderResponse';
import { IListOrderReturnType } from './endpointReturnType/IListOrderReturnType';
import { IGetOrderReturnType } from './endpointReturnType/IGetOrderReturnType';

@Controller('orders')
export class OrderController {
  constructor(
    @Inject('ORDER_SERVICE')
    private readonly orderServiceClient: ClientProxy,
  ) {}

  @Post()
  public async createOrder(@Body() body: CreateOrderDTO) {
    // here send the message to order service
    console.log('========== START CREATE ORDER ==========');
    let result: ICreateOrderReturnType;
    try {
      const res: ICreateOrderResponse = await firstValueFrom(
        this.orderServiceClient.send('create_order', body),
      );

      if (res.status !== 200) {
        console.log('========== DONE CREATE ORDER BUT FAILED==========');
        result = {
          ok: false,
          payment: res.message,
          created: null,
        };
      } else {
        console.log('========== DONE CREATE ORDER ==========');
        result = {
          ok: true,
          created: {
            id: res.order.id,
          },
          payment: res.message,
        };
      }
    } catch (err) {
      console.log('========== START CREATE ORDER DONE ==========');
      result = {
        ok: false,
        payment: 'Create order problem',
        created: null,
      };
    }
    return result;
  }

  @Get('/status/:orderId')
  public async checkStatus(@Param('orderId') orderId: string) {
    console.log('========== START CHECK ORDER STATUS==========');
    let result: ICheckOrderReturnType;

    try {
      const res: ICheckOrderResponse = await firstValueFrom(
        this.orderServiceClient.send('check_order_status', orderId),
      );
      console.log('========== START CCHECK ORDER STATUS DONE ==========');

      if (res.status != 200) {
        result = {
          ok: false,
          orderStatus: null,
        };
      } else {
        result = {
          ok: true,
          orderStatus: res.orderStatus,
        };
      }
    } catch (error) {
      console.log('========== START CCHECK ORDER STATUS ERROR==========');
      result = {
        ok: false,
        orderStatus: null,
      };
    }

    return result;
  }

  @Get('/:userId')
  public async listOrder(@Param('userId') userId: string) {
    console.log('========== START LIST ORDER ==========');
    // here get order stuff
    let result: IListOrderReturnType;
    try {
      const res: IListOrderResponse = await firstValueFrom(
        this.orderServiceClient.send('list_order', userId),
      );
      console.log('==========DONE START CREATE ORDER ==========');
      if (res.status != 200) {
        result = {
          ok: false,
          orders: null,
        };
      }

      result = {
        ok: true,
        orders: res.orders,
      };
    } catch (error) {
      console.log('========== START CREATE ORDER ERROR==========');
      result = {
        ok: false,
        orders: null,
      };
    }

    return result;
  }

  @Get('/one/:orderId')
  public async findOrderByOrderId(@Param('orderId') orderId: string) {
    // here get order stuff
    console.log('========== START FIND ORDER BY ID ==========');
    let result: IGetOrderReturnType;
    console.log(orderId);
    try {
      const res: IGetOrderResponse = await firstValueFrom(
        this.orderServiceClient.send('find_order_by_id', orderId),
      );
      console.log(res);
      console.log('========== DONE START FIND ORDER BY ID  ==========');

      // TODO: reason: BSONTypeError: Argument passed in must be a string of 12 bytes or a string of 24 hex characters
      if (res.status !== 200) {
        result = {
          ok: false,
          order: null,
        };
      } else {
        result = {
          ok: true,
          order: res.order,
        };
      }
    } catch (error) {
      console.log('========== START FIND ORDER BY ID ERROR==========');
      result = {
        ok: false,
        order: null,
      };
    }

    return result;
  }

  @Put()
  public async updateOrder(@Body() body: UpdateOrderDto) {
    console.log('========== UPDATE CREATE ORDER ==========');
    let result;
    // here get order stuff
    try {
      const res = await firstValueFrom(
        this.orderServiceClient.send('update_order', body),
      );

      console.log(res);
      result = {
        ok: true,
        message: 'Update order success',
      };
    } catch (err) {
      result = {
        ok: false,
        message: 'Update order failed',
      };
    }
    return result;
  }
}
