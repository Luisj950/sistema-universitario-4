import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { UniversidadService } from './universidad.service';

@Controller('universidad')
export class UniversidadController {
  constructor(private readonly service: UniversidadService) {}

  @Get('estudiantes-activos')
  listarEstudiantesActivos() {
    return this.service.listarEstudiantesActivos();
  }

  @Get('reporte-matriculas')
  obtenerReporteMatriculas() {
    return this.service.obtenerReporteMatriculas();
  }

  @Post('matricular')
  matricularEstudiante(@Body() data: { estudianteId: string; asignaturaId: string }) {
    return this.service.matricularEstudiante(data.estudianteId, data.asignaturaId);
  }
}