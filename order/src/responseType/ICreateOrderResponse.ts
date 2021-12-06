import { IOrder } from 'src/type/IOrder';

export interface ICreateOrderResponse {
  status: number;
  message: string;
  order: IOrder | null;
}
