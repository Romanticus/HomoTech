import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('admin/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async login(@Body() body: { password: string }) {
    return this.authService.validateAdmin(body.password);
  }
}