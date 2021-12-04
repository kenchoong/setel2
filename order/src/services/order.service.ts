import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IOrder } from 'src/type/IOrder';
import { IOrderCheckParams } from 'src/type/IOrderCheckParams';
import { IOrderCreateParams } from 'src/type/IOrderCreateParams';
import { IOrderUpdateParams } from 'src/type/IOrderUpdateParams';
import { IOrderUpdateResult } from 'src/type/IUpdateOrderResult';
import { ICheckOrderResult } from 'src/type/ICheckOrderResult';
import { IReceivePaymentStatusParams } from 'src/type/IReceivePaymentStatusParams';
import { IUpdatePaymentStatusResult } from 'src/type/IUpdatePaymentStatusResult';

// https://docs.nestjs.com/recipes/mongodb#mongodb-mongoose

// https://docs.nestjs.com/techniques/mongodb

@Injectable()
export class OrderService {
  constructor(
    @InjectModel('Order') private readonly orderModel: Model<IOrder>,
  ) {}

  async createOrder(orderBody: IOrderCreateParams): Promise<IOrder> {
    const orderModel = new this.orderModel(orderBody);
    return await orderModel.save();
  }

  async checkOrderStatus(data: IOrderCheckParams): Promise<ICheckOrderResult> {
    return this.orderModel.findById(data.orderId);
  }

  async listOrder(userId: string): Promise<IOrder[]> {
    return this.orderModel.find({ userId: userId }).exec();
  }

  async findOrderByOrderId(data: IOrderCheckParams): Promise<IOrder> {
    return await this.orderModel.findById(data.orderId);
  }

  async updateOrder(params: IOrderUpdateParams): Promise<IOrderUpdateResult> {
    return await this.orderModel.findByIdAndUpdate(
      { _id: params.orderId },
      params,
    );
  }

  async updatePaymentStatus(
    params: IReceivePaymentStatusParams,
  ): Promise<IUpdatePaymentStatusResult> {
    return await this.orderModel.findByIdAndUpdate(
      { _id: params.orderId },
      params,
    );
  }
}
