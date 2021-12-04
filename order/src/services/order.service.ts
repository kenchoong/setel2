import { Model } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IOrder } from 'src/type/IOrder';
import { IOrderCheckParams } from 'src/type/IOrderCheckParams';
import { IOrderCreateParams } from 'src/type/IOrderCreateParams';
import { IOrderUpdateParams } from 'src/type/IOrderUpdateParams';
import { IOrderUpdateResult } from 'src/type/IUpdateOrderResult';
import { ICheckOrderResult } from 'src/type/ICheckOrderResult';

// https://docs.nestjs.com/recipes/mongodb#mongodb-mongoose

// https://docs.nestjs.com/techniques/mongodb

@Injectable()
export class OrderService {
  constructor(
    @InjectModel('Order') private readonly orderModel: Model<IOrder>,
  ) {}
  // figure out later

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

  /*
  async updateOrder(
    updateBody: IOrderUpdateParams,
  ): Promise<IOrderUpdateResult> {
    
    return await this.orderModel.updateOne(
      { orderId: updateBody.orderId },
      updateBody,
    );
  }*/
}
