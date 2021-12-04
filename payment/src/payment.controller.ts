import { Controller, Inject } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { EventPattern, ClientProxy } from '@nestjs/microservices';
import { ProcessPaymentPayload } from './dto/ProcessPaymentDto';
import { IReceivePaymentStatusParams } from './dto/IReceivePaymentStatusParams';

@Controller()
export class PaymentController {
  constructor(
    @Inject('PAYMENT_SERVICE')
    private readonly paymentClient: ClientProxy,
    private readonly paymentService: PaymentService,
  ) {}

  async publishEvent(payStatus: IReceivePaymentStatusParams): Promise<any> {
    return this.paymentClient.emit('receive_payment_status', payStatus);
  }

  @EventPattern('process_order_payment')
  async processPayment(payload: ProcessPaymentPayload): Promise<void> {
    // here need to emit back to order service
    if (payload && payload.productId) {
      let messagePayload: IReceivePaymentStatusParams;
      try {
        const paymentStatus = await this.paymentService.processThePayment(
          payload.productId,
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
