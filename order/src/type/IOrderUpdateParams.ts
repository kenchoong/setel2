class UpdateOrderDto {
  orderStatus: string;
  userId: string;
}

export interface IOrderUpdateParams {
  orderId: string;
  body: UpdateOrderDto;
}
