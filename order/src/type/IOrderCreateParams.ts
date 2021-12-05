import { Document } from 'mongoose';

export interface IOrderCreateParams extends Document {
  userId: string;
  productId: string;
  productName: string;
  totalOrderAmount: string;
  orderStatus: string;
  paymentStatus: string;
  createdAt: string;
}
