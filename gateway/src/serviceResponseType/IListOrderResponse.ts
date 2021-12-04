import { IOrder } from 'src/type/IOrder';

export interface IListOrderResponse {
  status: number;
  message: string;
  orders: IOrder[] | null;
}
