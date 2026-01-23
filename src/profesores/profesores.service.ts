import { Injectable } from '@nestjs/common';
import { CreateProfesorDto } from './dto/create-profesor.dto';
import { UpdateProfesorDto } from './dto/update-profesor.dto';
// CAMBIO IMPORTANTE
import { PrismaProfesoresService } from '../prisma/prisma-profesores.service';

@Injectable()
export class ProfesoresService {
  constructor(private prisma: PrismaProfesoresService) {}

  create(createProfesorDto: CreateProfesorDto) {
    return this.prisma.docente.create({
      data: createProfesorDto,
    });
  }

  findAll() {
    return this.prisma.docente.findMany();
  }

  findOne(id: string) {
    return this.prisma.docente.findUnique({ where: { id } });
  }

  update(id: string, updateProfesorDto: UpdateProfesorDto) {
    return this.prisma.docente.update({
      where: { id },
      data: updateProfesorDto,
    });
  }

  remove(id: string) {
    return this.prisma.docente.delete({ where: { id } });
  }
}