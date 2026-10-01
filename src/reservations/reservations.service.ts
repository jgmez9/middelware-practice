import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto.js';
import { Reservation } from './entities/reservation.entity.js';

@Injectable()
export class ReservationsService {
  private readonly reservations: Reservation[] = [];
  private nextId = 1;

  create(createReservationDto: CreateReservationDto): Reservation {
    const email = createReservationDto.email.trim().toLowerCase();

    const existingReservation = this.reservations.find(
      (reservation) => reservation.email === email,
    );

    if (existingReservation) {
      throw new BadRequestException(
        'A reservation with this email already exists',
      );
    }

    const reservation: Reservation = {
      id: this.nextId++,
      customerName: createReservationDto.customerName.trim(),
      email,
      people: createReservationDto.people,
    };

    this.reservations.push(reservation);

    return reservation;
  }

  findAll(): Reservation[] {
    return [...this.reservations];
  }

  findOne(id: number): Reservation {
    const reservation = this.reservations.find(
      (item) => item.id === id,
    );

    if (!reservation) {
      throw new NotFoundException(`Reservation #${id} not found`);
    }

    return reservation;
  }
}
