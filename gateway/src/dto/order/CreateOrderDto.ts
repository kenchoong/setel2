import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDTO {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  productId: string;

  @ApiProperty()
  productName: string;

  @ApiProperty()
  totalOrderAmount: string;

  @ApiProperty()
  orderStatus: string;

  @ApiProperty()
  createdAt: string;
}
