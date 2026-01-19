import { Injectable } from '@nestjs/common';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';
import { UpdateEstudianteDto } from './dto/update-estudiante.dto';
import { PrismaCarrerasService } from '../prisma/prisma-carreras.service';

@Injectable()
export class EstudiantesService {
  constructor(private prisma: PrismaCarrerasService) {}

  async create(createEstudianteDto: CreateEstudianteDto) {
    // SOLUCIÓN: Asignamos los campos manualmente para evitar el error de tipos
    return this.prisma.estudiante.create({
      data: {
        nombre: createEstudianteDto.nombre,
        apellido: createEstudianteDto.apellido,
        carreraId: createEstudianteDto.carreraId, // <--- Aquí TypeScript ya entiende que es el ID directo
      },
    });
  }

  async findAll() {
    return this.prisma.estudiante.findMany({
      include: {
        inscripciones: true,
        // carrera: true // Si quisieras traer los datos de la carrera (opcional)
      }
    });
  }

  async findOne(id: string) {
    return this.prisma.estudiante.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateEstudianteDto: UpdateEstudianteDto) {
    return this.prisma.estudiante.update({
      where: { id },
      data: updateEstudianteDto,
    });
  }

  async remove(id: string) {
    return this.prisma.estudiante.delete({
      where: { id },
    });
  }
}