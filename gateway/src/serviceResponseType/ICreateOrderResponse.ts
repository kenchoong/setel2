import { IOrder } from '../endpointReturnType/IOrder';

export interface ICreateOrderResponse {
  status: number;
  message: string;
  order: IOrder | null;
}
