// common/guards/admin.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['x-admin-token'];
    
    try {
      const payload = this.jwtService.verify(token, {
        secret: this.config.get('ADMIN_SECRET'),
      });
      return payload.role === 'admin';
    } catch (e) {
      return false;
    }
  }
}