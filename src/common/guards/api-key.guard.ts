import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  private readonly validApiKey = 'restaurant-secret';

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const apiKey = request.header('x-api-key');

    if (apiKey !== this.validApiKey) {
      throw new ForbiddenException('Invalid or missing API Key');
    }

    return true;
  }
}
