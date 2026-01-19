import { IsString, IsOptional } from 'class-validator';

export class UpdateProfesorDto {
  @IsString()
  @IsOptional()
  nombre?: string;

  @IsString()
  @IsOptional()
  apellido?: string;
}
