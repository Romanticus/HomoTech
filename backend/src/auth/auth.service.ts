import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async validateAdmin(password: string) {
    const ADMIN_PASSWORD= this.config.get('ADMIN_PASSWORD')
 
    if (password !== ADMIN_PASSWORD) {
      throw new UnauthorizedException('Неверный пароль');
    }
    
    return {
      access_token: this.jwtService.sign({ role: 'admin' }),
    };
  }
}