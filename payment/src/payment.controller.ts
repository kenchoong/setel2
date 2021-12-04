import { Controller, Inject } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { EventPattern, ClientProxy } from '@nestjs/microservices';
import { ProcessPaymentPayload } from './dto/ProcessPaymentDto';

@Controller()
export class PaymentController {
  constructor(
    @Inject('PAYMENT_SERVICE')
    private readonly paymentClient: ClientProxy,
    private readonly paymentService: PaymentService,
  ) {}

  async publishEvent(payload: ProcessPaymentPayload): Promise<any> {
    return this.paymentClient.emit('receive_order_status', payload);
  }

  @EventPattern('process_payment')
  processPayment(): string {
    // here need to emit back to order service
    return this.paymentService.processThePayment();
  }
}
