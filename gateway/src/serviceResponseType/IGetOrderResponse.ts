import { IOrder } from '../endpointReturnType/IOrder';

export interface IGetOrderResponse {
  status: number;
  message: string;
  order: IOrder | null;
}
