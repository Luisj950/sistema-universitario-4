// src/estudiantes/dto/create-estudiante.dto.ts
import { IsString, IsNotEmpty } from 'class-validator'; // Si usas validaciones (opcional)

export class CreateEstudianteDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  apellido: string;

  // 👇 AGREGA ESTO 👇
  @IsString()
  @IsNotEmpty()
  carreraId: string; 
}