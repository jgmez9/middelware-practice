import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const start = Date.now();
    const timestamp = new Date().toLocaleTimeString();

    console.log(`[REQUEST] ${req.method} ${req.originalUrl} - ${timestamp}`);

    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(
        `[RESPONSE] ${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`,
      );
    });

    next();
  }
}
