interface ProcessPaymentInterface {
  productId: string;
  orderId: string;
  userId: string;
}

export class ProcessPaymentPayload implements ProcessPaymentInterface {
  productId: string;
  orderId: string;
  userId: string;

  constructor(productId: string, orderId: string, userId: string) {
    this.productId = productId;
    this.orderId = orderId;
    this.userId = userId;
  }

  // here we can assign some rules for the data
}
