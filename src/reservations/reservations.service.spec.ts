import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ReservationsService } from './reservations.service.js';

describe('ReservationsService', () => {
  let service: ReservationsService;

  beforeEach(() => {
    service = new ReservationsService();
  });

  it('should create a reservation', () => {
    const reservation = service.create({
      customerName: 'Carlos Pérez',
      email: 'CARLOS@EMAIL.COM',
      people: 4,
    });

    expect(reservation).toEqual({
      id: 1,
      customerName: 'Carlos Pérez',
      email: 'carlos@email.com',
      people: 4,
    });
  });

  it('should reject duplicated emails', () => {
    service.create({
      customerName: 'Carlos Pérez',
      email: 'carlos@email.com',
      people: 4,
    });

    expect(() =>
      service.create({
        customerName: 'Ana López',
        email: 'CARLOS@EMAIL.COM',
        people: 2,
      }),
    ).toThrow(BadRequestException);
  });

  it('should find a reservation by id', () => {
    service.create({
      customerName: 'Carlos Pérez',
      email: 'carlos@email.com',
      people: 4,
    });

    expect(service.findOne(1).id).toBe(1);
  });

  it('should throw when the reservation does not exist', () => {
    expect(() => service.findOne(99)).toThrow(NotFoundException);
  });
});
