import { ApiProperty } from '@nestjs/swagger';

export class LoginCmd {
  @ApiProperty()
  username: string;

  @ApiProperty()
  password: string;
}
