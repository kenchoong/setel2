import { IOrder } from 'src/type/IOrder';

export interface IGetOrderResponse {
  status: number;
  message: string;
  order: IOrder | null;
}
