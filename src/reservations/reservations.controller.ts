import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiKeyGuard } from '../common/guards/api-key.guard.js';
import { ResponseInterceptor } from '../common/interceptors/response.interceptor.js';
import { CreateReservationDto } from './dto/create-reservation.dto.js';
import { Reservation } from './entities/reservation.entity.js';
import { ReservationsService } from './reservations.service.js';

@Controller('reservations')
@UseInterceptors(ResponseInterceptor)
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Get()
  findAll(): Reservation[] {
    return this.reservationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Reservation {
    return this.reservationsService.findOne(id);
  }

  @Post()
  @UseGuards(ApiKeyGuard)
  create(@Body() createReservationDto: CreateReservationDto): Reservation {
    return this.reservationsService.create(createReservationDto);
  }
}
