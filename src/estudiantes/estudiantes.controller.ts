import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { EstudiantesService } from './estudiantes.service';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';
import { UpdateEstudianteDto } from './dto/update-estudiante.dto';
import { JwtAuthGuard } from '../Auth/jwt-auth.guard'; // 👈 Asegúrate de importar el Guard

@Controller('estudiantes')
export class EstudiantesController {
  constructor(private readonly estudiantesService: EstudiantesService) {}

  // POST: Crear un estudiante (Público, cualquiera puede crear)
  @Post()
  create(@Body() createEstudianteDto: CreateEstudianteDto) {
    return this.estudiantesService.create(createEstudianteDto);
  }

  // GET: Ver todos los estudiantes (PRIVADO 🔒 - Requiere Token)
  @UseGuards(JwtAuthGuard) 
  @Get()
  findAll() {
    return this.estudiantesService.findAll();
  }

  // GET: Ver un solo estudiante por ID (Público en este ejemplo)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.estudiantesService.findOne(id);
  }

  // PATCH: Actualizar estudiante (Público en este ejemplo)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEstudianteDto: UpdateEstudianteDto) {
    return this.estudiantesService.update(id, updateEstudianteDto);
  }

  // DELETE: Eliminar estudiante (Público en este ejemplo)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.estudiantesService.remove(id);
  }
}