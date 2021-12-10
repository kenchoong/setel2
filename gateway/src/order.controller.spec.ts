import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { CreateOrderDTO } from './dto/order/CreateOrderDto';
import { ClientProxy, ClientProxyFactory } from '@nestjs/microservices';

const mockClientProxy = () => ({
  send: jest.fn(),
  connect: jest.fn(),
  close: jest.fn(),
  routingMap: jest.fn(),
});

describe('OrdersController', () => {
  let orderController: OrderController;
  let orderServiceClient: ClientProxy;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [OrderController],
      providers: [
        {
          provide: 'ORDER_SERVICE',
          useFactory: mockClientProxy,
        },
        {
          provide: 'PAYMENT-SERVICE',
          useValue: {
            emit: jest.fn(),
          },
        },
      ],
    }).compile();

    orderController = app.get<OrderController>(OrderController);
    orderServiceClient = app.get<ClientProxy>('ORDER_SERVICE');
  });

  describe('Order suit', () => {
    it('Create order success', async (done) => {
      const body: CreateOrderDTO = {
        userId: '1234',
        productId: '1',
        productName: 'abcd',
        totalOrderAmount: 'RM99',
        orderStatus: 'processing',
        createdAt: '12345',
      };

      //orderServiceClient.send.mockReturnValue();

      expect(await orderController.createOrder(body)).toStrictEqual({
        ok: true,
        created: {
          id: 'abc-1234',
        },
        payment: 'processing',
      });
    });

    /*
    it('Create order failed', () => {});

    it('get single order sucess', () => {});

    it('Get single order failed', () => {});

    it('Get order list', () => {});
    */
  });
});
