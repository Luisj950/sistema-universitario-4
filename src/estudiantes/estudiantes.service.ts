import { Injectable } from '@nestjs/common';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';
import { UpdateEstudianteDto } from './dto/update-estudiante.dto';
// CAMBIO IMPORTANTE: Importamos el servicio específico
import { PrismaUsuariosService } from '../prisma/prisma-usuarios.service';

@Injectable()
export class EstudiantesService {
  // Inyectamos PrismaUsuariosService en lugar de PrismaService
  constructor(private prisma: PrismaUsuariosService) {} 

  create(createEstudianteDto: CreateEstudianteDto) {
    return this.prisma.estudiante.create({
      data: createEstudianteDto,
    });
  }

  findAll() {
    return this.prisma.estudiante.findMany();
  }

  findOne(id: string) {
    return this.prisma.estudiante.findUnique({
      where: { id },
    });
  }

  update(id: string, updateEstudianteDto: UpdateEstudianteDto) {
    return this.prisma.estudiante.update({
      where: { id },
      data: updateEstudianteDto,
    });
  }

  remove(id: string) {
    return this.prisma.estudiante.delete({
      where: { id },
    });
  }
}