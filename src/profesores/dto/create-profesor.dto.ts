import { IsString, IsNotEmpty } from 'class-validator';

export class CreateProfesorDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  apellido: string;
}
