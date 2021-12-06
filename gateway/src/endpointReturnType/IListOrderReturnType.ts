import { IOrder } from './IOrder';
export interface IListOrderReturnType {
  ok: boolean;
  orders: IOrder[] | null;
}
