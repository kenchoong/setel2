import { Injectable } from '@nestjs/common';

@Injectable()
export class PaymentService {
  processThePayment(productId: string): Promise<string> {
    return new Promise((resolve, reject) => {
      if (productId === '1') {
        resolve('Success');
      } else {
        reject('Declined');
      }
    });
  }
}
