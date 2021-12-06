import { Document } from 'mongoose';

export interface IUpdatePaymentStatusResult extends Document {
  paymentStatus: string;
}
