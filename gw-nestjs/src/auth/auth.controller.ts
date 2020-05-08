import { Controller, Request, UseGuards, Post, Get, Body } from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { SignUpCmd } from './models/cmd/sign-up.cmd';
import { User } from 'src/users/models/user.entity';
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
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
