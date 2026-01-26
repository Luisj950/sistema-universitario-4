// src/estudiantes/estudiantes.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';
import { UpdateEstudianteDto } from './dto/update-estudiante.dto';
import { PrismaUsuariosService } from '../prisma/prisma-usuarios.service';

@Injectable()
export class EstudiantesService {
  constructor(private prisma: PrismaUsuariosService) {}

  async create(createEstudianteDto: CreateEstudianteDto) {
    return this.prisma.estudiante.create({
      data: createEstudianteDto,
    });
  }

  async findAll() {
    return this.prisma.estudiante.findMany();
  }

  async findOne(id: string) {
    const estudiante = await this.prisma.estudiante.findUnique({
      where: { id },
    });
    if (!estudiante) throw new NotFoundException(`Estudiante con ID ${id} no encontrado`);
    return estudiante;
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