import { IOrder } from './IOrder';
export interface IGetOrderReturnType {
  ok: boolean;
  order: IOrder | null;
}
