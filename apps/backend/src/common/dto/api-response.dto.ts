import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseDto<T> {
  @ApiProperty({ example: true })
  success!: boolean;

  @ApiProperty()
  data!: T;

  @ApiProperty()
  timestamp!: string;

  @ApiProperty({ required: false })
  message?: string;
}
