import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCarreraDto {
  @IsString() @IsNotEmpty()
  nombre: string;
}