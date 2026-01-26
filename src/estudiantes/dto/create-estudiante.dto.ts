import { IsEmail, IsNotEmpty, IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateEstudianteDto {
  @IsString() @IsNotEmpty()
  nombre: string;

  @IsString() @IsNotEmpty()
  apellido: string;

  @IsEmail() @IsNotEmpty()
  email: string;

  @IsString() @IsNotEmpty()
  password: string;

  @IsString() @IsNotEmpty()
  carreraId: string;

  @IsBoolean() @IsOptional()
  activo?: boolean;
}