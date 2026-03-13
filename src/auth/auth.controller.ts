import { Controller, Post, Body, HttpCode, HttpStatus, Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('admin/login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.loginAdmin(loginDto);
  }

  // Example of a protected admin route
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('platform')
  @Get('admin/me')
  getProfile(@Request() req: any) {
    return req.user;
  }
}
