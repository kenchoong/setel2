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

import { ProcessPaymentPayload } from './dto/payment/ProcessPaymentPayloadDto';

@Controller('orders')
export class OrderController {
  constructor(
    @Inject('ORDER_SERVICE')
    private readonly orderServiceClient: ClientProxy,
  ) {}

  async publishEvent(payload: ProcessPaymentPayload): Promise<any> {
    return this.orderServiceClient.emit('process_payment', payload);
  }

  @Post()
  public async createOrder(@Body() body: CreateOrderDTO) {
    // here send the message to order service
    let result: ICreateOrderReturnType;
    try {
      const res: ICreateOrderResponse = await firstValueFrom(
        this.orderServiceClient.send('create_order', body),
      );

      if (res.status !== 200) {
        result = {
          ok: false,
          payment: 'failed',
          created: null,
        };
      } else {
        try {
          // trigger payment method
          const orderObject = res.order;
          await this.publishEvent(
            new ProcessPaymentPayload(
              orderObject.productId,
              orderObject.orderId,
              orderObject.userId,
            ),
          );

          // no problem then return the response to client
          result = {
            ok: true,
            created: {
              id: res.order.orderId,
            },
            payment: 'processing',
          };
        } catch (err) {
          result = {
            ok: false,
            payment: 'failed',
            created: null,
          };
        }
      }
    } catch (err) {
      result = {
        ok: false,
        payment: 'failed',
        created: null,
      };
    }
    return result;
  }

  @Get('/status/:orderId/:userId')
  public async checkStatus(
    @Param('orderId') orderId: string,
    @Param('userId') userId: string,
  ) {
    // here check status
    let result: ICheckOrderReturnType;

    try {
      const res: ICheckOrderResponse = await firstValueFrom(
        this.orderServiceClient.send('check_order_status', userId),
      );

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
      result = {
        ok: false,
        orderStatus: null,
      };
    }

    return result;
  }

  @Get(':userId')
  public async listOrder(@Param('userId') userId: string) {
    // here get order stuff
    let result: IListOrderReturnType;
    try {
      const res: IListOrderResponse = await firstValueFrom(
        this.orderServiceClient.send('list_order', userId),
      );

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
      result = {
        ok: false,
        orders: null,
      };
    }

    return result;
  }

  @Get('/:userId/:orderId')
  public async findOrderByOrderId(
    @Param('orderId') orderId: string,
    @Param('userId') userId: string,
  ) {
    // here get order stuff
    let result: IGetOrderReturnType;
    try {
      const res: IGetOrderResponse = await firstValueFrom(
        this.orderServiceClient.send('find_order_by_id', {
          orderId: orderId,
          userId: userId,
        }),
      );

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
      result = {
        ok: false,
        order: null,
      };
    }

    return result;
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
