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
  Redirect,
  Response,
  BadRequestException,
} from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { SignUpCmd } from './models/cmd/sign-up.cmd';
import { User } from '../users/models/user.entity';
import { TokenDto } from './models/dto/token.dto';
import { UsersService } from 'src/users/users.service';
import { GetProfileDto } from './models/dto/get-profile.dto';
import { ChangePasswordDto } from './models/dto/change-password-dto';
import { ChangePasswordCmd } from './models/cmd/change-password.cmd';
import { ConfigService } from '@nestjs/config';
import { ResetPasswordCmd } from './models/cmd/reset-password.cmd';
import { ResetPasswordDto } from './models/dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private configService: ConfigService,
  ) {}

  @Post('signup')
  async signUp(@Body() user: SignUpCmd): Promise<TokenDto> {
    return await this.authService.signUp(new User(user));
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(200)
  async login(@Request() req) {
    return this.authService.login(new User(req.user));
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    const user = await this.usersService.findOne({ id: req.user.sub });
    return new GetProfileDto(user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('change-password')
  async changePassword(
    @Body() cmd: ChangePasswordCmd,
  ): Promise<ChangePasswordDto> {
    const updatedPasswordResult = await this.usersService.updatePassword(cmd);
    return new ChangePasswordDto(updatedPasswordResult);
  }

  //this generate token and send the email with it, for user to click
  @Get('forgot-password/:email')
  async forgotPassword(
    @Param('email') email: string,
  ): Promise<ResetPasswordDto> {
    const user = await this.usersService.findOne({ email });
    return this.authService.sendEmailPasswordReset(user);
  }

  //this get activated after user click on the link from the email
  @Get('verify/:token')
  async verifyToken(
    @Param('token') token: string,
    @Response() res,
  ): Promise<TokenDto> {
    try {
      await this.authService.verifyToken(token);
      const link = `${this.configService.get<string>('WEB')}/token/${token}`;
      return res.redirect(link + token);
    } catch (error) {
      throw new BadRequestException(`Invalid token.`);
    }
  }

  //this will take the payload with the new password and token
  @Post('reset-password')
  @HttpCode(200)
  async resetPassword(
    @Body() model: ResetPasswordCmd,
  ): Promise<ChangePasswordDto> {
    try {
      const decoded = await this.authService.verifyToken(model.token);
      const resetPasswordResult = await this.usersService.resetPassword(
        decoded.id,
        model.password,
      );
      return new ChangePasswordDto(resetPasswordResult);
    } catch (error) {
      throw new BadRequestException(`Invalid token.`);
    }
  }
}
