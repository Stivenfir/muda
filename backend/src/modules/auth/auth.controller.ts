import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() body: LoginDto, @Req() req: any) {
    const userAgent = Array.isArray(req.headers['user-agent'])
      ? req.headers['user-agent'][0]
      : req.headers['user-agent'];

    return this.authService.login(body.username, body.password, req.ip, userAgent);
  }

  @Post('refresh')
  refresh(@Body() body: RefreshTokenDto, @Req() req: any) {
    const userAgent = Array.isArray(req.headers['user-agent'])
      ? req.headers['user-agent'][0]
      : req.headers['user-agent'];

    return this.authService.refresh(body.refreshToken, req.ip, userAgent);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@Req() req: any, @Body() body: Partial<RefreshTokenDto>) {
    const userAgent = Array.isArray(req.headers['user-agent'])
      ? req.headers['user-agent'][0]
      : req.headers['user-agent'];
    const user = req.user as { userId: number };
    return this.authService.logout(user.userId, body?.refreshToken, req.ip, userAgent);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: any) {
    return req.user;
  }
}
