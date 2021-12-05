interface NotifyOrderInterface {
  orderId: string;
  orderStatus: string;
}

export class NotifyOrderPayload implements NotifyOrderInterface {
  orderId: string;
  orderStatus: string;

  constructor(orderId: string, orderStatus: string) {
    this.orderId = orderId;
    this.orderStatus = orderStatus;
  }

  // here we can assign some rules for the data
}
