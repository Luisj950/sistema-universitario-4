import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { UniversidadService } from './universidad.service';

@Controller('universidad')
export class UniversidadController {
  constructor(private readonly service: UniversidadService) {}

  // --- LISTADO GENERAL ---
  @Get('asignaturas')
  listarAsignaturas() {
    return this.service.findAllAsignaturas();
  }

  // --- PARTE 1: CONSULTAS DERIVADAS ---
  @Get('estudiantes-activos')
  listarEstudiantesActivos() {
    return this.service.listarEstudiantesActivos();
  }

  @Get('asignaturas-carrera/:id')
  obtenerAsignaturas(@Param('id') id: string) {
    return this.service.obtenerAsignaturasPorCarrera(id);
  }

  // --- PARTE 2: OPERADORES LÓGICOS ---
  @Get('docentes-carga-alta')
  listarDocentesCargaAlta() {
    return this.service.listarDocentesCargaAlta();
  }

  @Get('matriculas-periodo')
  listarMatriculas(
    @Query('estudianteId') eId: string, 
    @Query('periodoId') pId: string
  ) {
    return this.service.listarMatriculasEstudiante(eId, pId);
  }

  // --- PARTE 3: CONSULTA NATIVA SQL ---
  @Get('reporte-matriculas')
  obtenerReporteMatriculas() {
    return this.service.obtenerReporteMatriculas();
  }

  // --- PARTE 4: OPERACIÓN TRANSACCIONAL (ACID) ---
  @Post('matricular')
  matricularEstudiante(@Body() data: { estudianteId: string; asignaturaId: string }) {
    return this.service.matricularEstudiante(data.estudianteId, data.asignaturaId);
  }
}