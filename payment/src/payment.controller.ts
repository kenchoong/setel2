import { Controller, Inject } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { EventPattern, ClientProxy } from '@nestjs/microservices';
import { ProcessPaymentPayload } from './dto/ProcessPaymentDto';
import { NotifyOrderPayload } from './dto/NotifyOrderDto';

@Controller()
export class PaymentController {
  constructor(
    @Inject('ORDER_SERVICE')
    private readonly orderClient: ClientProxy,

    private readonly paymentService: PaymentService,
  ) {}

  async publishEvent(payStatus: NotifyOrderPayload): Promise<any> {
    console.log('========== EMIT MESSAGE TO ORDER SERVICE==========');
    console.log(payStatus);
    return this.orderClient.emit('receive_payment_status', payStatus);
  }

  @EventPattern('process_order_payment')
  async processPayment(payload: ProcessPaymentPayload): Promise<void> {
    // here need to emit back to order service
    console.log('========== START PROCESS ORDER PAYMENT SERVICE==========');
    if (payload && payload.orderId && payload.productId) {
      try {
        const orderStatus = await this.paymentService.processThePayment(
          payload.productId,
        );

        console.log(
          '========== DONE START PROCESS ORDER PAYMENT SERVICE==========',
        );

        const notifyOrderPayload = new NotifyOrderPayload(
          payload.orderId,
          orderStatus,
        );

        this.publishEvent(notifyOrderPayload);
      } catch (error) {
        const notifyOrderPayload = new NotifyOrderPayload(
          payload.orderId,
          error,
        );
        this.publishEvent(notifyOrderPayload);
      }
    }
  }
}
