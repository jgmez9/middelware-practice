import { Type } from 'class-transformer';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateReservationDto {
  @IsString()
  @IsNotEmpty()
  customerName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(10)
  people: number;
}
