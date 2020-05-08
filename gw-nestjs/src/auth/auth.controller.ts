import { Controller, Request, UseGuards, Post, Get, Body } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { SignUpCmd } from './models/cmd/sign-up.cmd';
import { User } from '../users/models/user.entity';
import { TokenDto } from './models/dto/token.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}


  @Post('signup')
  async signUp(@Body() user: SignUpCmd): Promise<TokenDto> {
    return await this.authService.signUp(new User(user));
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(new User(req.user));
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
