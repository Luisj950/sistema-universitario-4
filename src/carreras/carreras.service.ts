import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CarrerasService {
  constructor(private prisma: PrismaService) {}

  async create(data: { nombre: string }) {
    return this.prisma.carrera.create({ data });
  }

  async findAll() {
    return this.prisma.carrera.findMany({
      include: { estudiantes: true },
    });
  }
}