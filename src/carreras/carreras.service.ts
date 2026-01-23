import { Injectable } from '@nestjs/common';
import { CreateCarreraDto } from './dto/create-carrera.dto';
import { UpdateCarreraDto } from './dto/update-carrera.dto';
// CAMBIO IMPORTANTE
import { PrismaCarrerasService } from '../prisma/prisma-carreras.service';

@Injectable()
export class CarrerasService {
  constructor(private prisma: PrismaCarrerasService) {}

  create(createCarreraDto: CreateCarreraDto) {
    return this.prisma.carrera.create({
      data: createCarreraDto,
    });
  }

  findAll() {
    // Como asignaturas está en el mismo esquema, el include SÍ funciona aquí
    return this.prisma.carrera.findMany({
      include: { asignaturas: true }, 
    });
  }

  findOne(id: string) {
    return this.prisma.carrera.findUnique({
      where: { id },
      include: { asignaturas: true },
    });
  }

  update(id: string, updateCarreraDto: UpdateCarreraDto) {
    return this.prisma.carrera.update({
      where: { id },
      data: updateCarreraDto,
    });
  }

  remove(id: string) {
    return this.prisma.carrera.delete({
      where: { id },
    });
  }
}