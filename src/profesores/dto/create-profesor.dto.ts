import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateProfesorDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  tipoContrato: string; // "TIEMPO_COMPLETO" o "MEDIO_TIEMPO"

  @IsString()
  @IsOptional()
  estado?: string;
}