import { Injectable } from '@nestjs/common';

@Injectable()
export class PaymentService {
  processThePayment(): Promise<string> {
    return;
  }
}
