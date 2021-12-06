import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IOrder } from 'src/type/IOrder';
import { IOrderCreateParams } from 'src/type/IOrderCreateParams';
import { IOrderUpdateParams } from 'src/type/IOrderUpdateParams';
import { ICheckOrderResult } from 'src/type/ICheckOrderResult';

import { IUpdatePaymentStatusResult } from 'src/type/IUpdatePaymentStatusResult';
import { NotifyOrderPayload } from 'src/dto/NotifyOrderDto';
// https://docs.nestjs.com/recipes/mongodb#mongodb-mongoose

// https://docs.nestjs.com/techniques/mongodb

@Injectable()
export class OrderService {
  constructor(
    @InjectModel('Order') private readonly orderModel: Model<IOrder>,
  ) {}

  public async createOrder(
    orderBody: IOrderCreateParams,
  ): Promise<IOrderCreateParams> {
    const orderModel = new this.orderModel(orderBody);
    const res = await orderModel.save();

    console.log('order model response = ', res);

    return res;
  }

  public async checkOrderStatus(orderId: string): Promise<ICheckOrderResult> {
    const res = this.orderModel.findById(orderId);
    return res;
  }

  public async listOrder(userId: string): Promise<IOrder[]> {
    return await this.orderModel.find({ userId: userId }).exec();
  }

  public async findOrderByOrderId(orderId: string) {
    return this.orderModel.findById(orderId);
  }

  public async updateOrder(params: IOrderUpdateParams): Promise<IOrder> {
    return await this.orderModel.findByIdAndUpdate(
      { _id: params.orderId },
      params,
    );
  }

  public async updateOrderStatus(
    params: NotifyOrderPayload,
  ): Promise<IUpdatePaymentStatusResult> {
    return await this.orderModel.findByIdAndUpdate(
      { _id: params.orderId },
      params,
    );
  }
}
