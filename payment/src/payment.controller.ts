import { Controller, Inject } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { EventPattern, ClientProxy } from '@nestjs/microservices';
import { ProcessPaymentPayload } from './dto/ProcessPaymentDto';
import { IReceivePaymentStatusParams } from './dto/IReceivePaymentStatusParams';

@Controller()
export class PaymentController {
  constructor(
    @Inject('ORDER_SERVICE')
    private readonly orderClient: ClientProxy,

    private readonly paymentService: PaymentService,
  ) {}

  async publishEvent(payStatus: IReceivePaymentStatusParams): Promise<any> {
    console.log('========== EMIT MESSAGE TO ORDER SERVICE==========');
    return this.orderClient.emit('receive_payment_status', payStatus);
  }

  @EventPattern('process_order_payment')
  async processPayment(payload: ProcessPaymentPayload): Promise<void> {
    // here need to emit back to order service
    console.log('========== START PROCESS ORDER PAYMENT SERVICE==========');
    if (payload && payload.productId) {
      let messagePayload: IReceivePaymentStatusParams;
      try {
        const paymentStatus = await this.paymentService.processThePayment(
          payload.productId,
        );

        console.log(
          '========== DONE START PROCESS ORDER PAYMENT SERVICE==========',
        );

        messagePayload = {
          paymentStatus: paymentStatus,
          orderId: payload.orderId,
        };
        this.publishEvent(messagePayload);
      } catch (error) {
        messagePayload = {
          paymentStatus: error,
          orderId: payload.orderId,
        };
        this.publishEvent(error);
      }
    }
  }
}
