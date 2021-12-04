import { Controller } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class PaymentController {
  constructor(private readonly appService: PaymentService) {}

  @MessagePattern('create_payment')
  processPayment(): string {
    return this.appService.getHello();
  }
}
