import {
  Controller,
  Request,
  UseGuards,
  Post,
  Get,
  Body,
  HttpCode,
  Patch,
  Param,
  Response,
  BadRequestException,
} from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { SignUpCmd } from './models/cmd/sign-up.cmd';
import { User, UserStatus } from '../users/models/user.entity';
import { TokenDto } from './models/dto/token.dto';
import { UsersService } from 'src/users/users.service';
import { GetProfileDto } from './models/dto/get-profile.dto';
import { ChangePasswordCmd } from './models/cmd/change-password.cmd';
import { ConfigService } from '@nestjs/config';
import { ResetPasswordCmd } from './models/cmd/reset-password.cmd';
import { SentEmailDto } from './models/dto/sent-email.dto';
import {
  IResponseBase,
  ResponseSuccess,
  ResponseError,
} from 'src/common/models/response';
import { TypeEmail } from './models/cmd/send-email.cmd';
import { AuthJwtService } from './auth-jwt.service';
import { LoginCmd } from './models/cmd/login.cmd';
import { ApiBody, ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private configService: ConfigService,
    private authJwtService: AuthJwtService,
  ) {}

  private webLink = `${this.configService.get<string>('web.url')}
  :${this.configService.get<string>('web.port')}/`;

  @Post('signup')
  async signUp(@Body() user: SignUpCmd): Promise<SentEmailDto> {
    return await this.authService.signUp(new User(user));
  }

  @UseGuards(LocalAuthGuard)
  
  @Post('login')
  @ApiBody({ type: LoginCmd })
  @HttpCode(200)
  async login(@Request() req) {
    return this.authService.login(new User(req.user));
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req): Promise<IResponseBase> {
    const user = await this.usersService.findOne({ id: req.user.id });
    return new ResponseSuccess<GetProfileDto>({
      result: new GetProfileDto(user),
    });
  }

  @UseGuards(JwtAuthGuard)
  @Patch('change-password')
  async changePassword(@Body() cmd: ChangePasswordCmd): Promise<IResponseBase> {
    const result = await this.usersService.updatePassword(cmd);
    return new ResponseSuccess<string>({ result });
  }

  //this generate token and send the email with it, for user to click
  @Get('forgot-password/:email')
  async forgotPassword(@Param('email') email: string): Promise<SentEmailDto> {
    const user = await this.usersService.findOne({ email });
    return this.authService.sendEmail(user, TypeEmail.RESET_PASSWORD);
  }

  //this get activated after user click on the link from the email
  @Get('verify/:token')
  async verifyToken(
    @Param('token') token: string,
    @Response() res,
  ): Promise<IResponseBase> {
    try {
      await this.authJwtService.verifyToken(token);
      return res.redirect(this.webLink + `token/${token}`);
    } catch (error) {
      throw new BadRequestException(
        new ResponseError({ message: 'Invalid token.' }),
      );
    }
  }

  //this will take the payload with the new password and token
  @Post('reset-password')
  @HttpCode(200)
  async resetPassword(@Body() model: ResetPasswordCmd): Promise<IResponseBase> {
    try {
      const decoded = await this.authJwtService.verifyToken(model.token);
      const result = await this.usersService.resetPassword(
        decoded.id,
        model.password,
      );
      return new ResponseSuccess<string>({ result });
    } catch (error) {
      throw new BadRequestException(
        new ResponseError({ message: 'Invalid token.' }),
      );
    }
  }

  @Get('verify-email/:token')
  async verifyEmailToken(
    @Param('token') token: string,
    @Response() res,
  ): Promise<TokenDto> {
    try {
      const decoded = await this.authJwtService.verifyToken(token);
      await this.usersService.update(
        decoded.id,
        new User({ status: UserStatus.CONFIRM }),
      );
      return res.redirect(this.webLink + 'login');
    } catch (error) {
      throw new BadRequestException(`Invalid token.`);
    }
  }
}
