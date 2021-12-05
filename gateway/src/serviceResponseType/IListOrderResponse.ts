import { IOrder } from '../endpointReturnType/IOrder';

export interface IListOrderResponse {
  status: number;
  message: string;
  orders: IOrder[] | null;
}
