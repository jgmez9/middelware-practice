import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggerMiddleware } from '../common/middleware/logger.middleware.js';
import { ReservationsController } from './reservations.controller.js';
import { ReservationsService } from './reservations.service.js';

@Module({
  controllers: [ReservationsController],
  providers: [ReservationsService],
})
export class ReservationsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes(ReservationsController);
  }
}
