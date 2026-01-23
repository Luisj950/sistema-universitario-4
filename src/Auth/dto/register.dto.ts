import { IsEmail, IsString, MinLength, IsNotEmpty, IsOptional } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString()
  nombre: string;

  // AGREGADO: Para evitar el error en el servicio
  @IsString()
  @IsOptional()
  apellido?: string;

  // AGREGADO: Para evitar errores con carreraId
  @IsString()
  @IsOptional()
  carreraId?: string;

  @IsEmail({}, { message: 'El email debe tener un formato válido' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;
}