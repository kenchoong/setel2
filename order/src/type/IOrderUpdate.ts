class UpdateOrderDto {
  orderStatus: string;
  userId: string;
}

export interface IOrderUpdate {
  orderId: string;
  body: UpdateOrderDto;
}
