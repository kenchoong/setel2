/*result = {
    ok: true,
    created: {
      id: res.order.orderId,
    },
    payment: 'processing',
  };*/

type created = {
  id: string;
};

export interface ICreateOrderReturnType {
  ok: boolean;
  created: created | null;
  payment: string;
}
