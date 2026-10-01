import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ReservationsModule } from './reservations/reservations.module.js';

@Module({
  imports: [ReservationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
