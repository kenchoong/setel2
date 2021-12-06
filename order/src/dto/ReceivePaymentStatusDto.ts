interface IReceivePaymentStatus {
  orderId: string;
  paymentStatus: string;
}

export class ReceivePaymentStatusDto implements IReceivePaymentStatus {
  orderId: string;
  paymentStatus: string;

  constructor(orderId: string, paymentStatus: string) {
    this.orderId = orderId;
    this.paymentStatus = paymentStatus;
  }

  // here we can assign some rules for the data
}
