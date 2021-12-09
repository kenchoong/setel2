import { ApiProperty } from '@nestjs/swagger';

export class UpdateOrderDto {
  @ApiProperty()
  orderStatus: string;

  @ApiProperty()
  orderId: string;
}
