import { Document } from 'mongoose';

// orderId no need cause the id is auto generate
export interface IOrder extends Document {
  userId: string;
  productId: string;
  productName: string;
  totalOrderAmount: string;
  orderStatus: string;
  createdAt: string;
  paymentStatus: string;
}
