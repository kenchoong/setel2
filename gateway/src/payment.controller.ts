import {
  Controller,
  Post,
  Put,
  Get,
  Body,
  Req,
  Inject,
  HttpStatus,
  HttpException,
  Param,
} from '@nestjs/common';

@Controller('payment')
export class PaymentController {
  public async processPayment() {
    // here get order stuff
  }
}
