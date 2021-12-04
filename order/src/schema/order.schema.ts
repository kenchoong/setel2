import * as mongoose from 'mongoose';
import { IOrder } from 'src/type/IOrder';

// Here I think can act like Entity
export const OrderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, 'UserId can not be empty'],
  },
  orderId: {
    type: String,
    required: [true, 'OrderId can not be empty'],
  },
  productId: {
    type: String,
    required: [true, 'ProductId can not be empty'],
  },
  productName: {
    type: String,
    required: [true, 'ProductName can not be empty'],
  },
  totalOrderAmount: {
    type: String,
    required: [true, 'TotalOrderAmount can not be empty'],
  },
  orderStatus: {
    type: String,
    required: [true, 'OrderStatus can not be empty'],
  },
  paymentStatus: {
    type: String,
    default: 'Processing',
  },
  createdAt: {
    type: String,
    required: [true, 'Date can not be empty'],
  },
});

OrderSchema.pre('validate', function (next) {
  const self = this as IOrder;

  if (this.isModified('userId') && self.createdAt) {
    this.invalidate('userId', 'The field value can not be updated');
  }
  next();
});
