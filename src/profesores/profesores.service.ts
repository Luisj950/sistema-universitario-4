import { Injectable } from '@nestjs/common';
import { PrismaProfesoresService } from '../prisma/prisma-profesores.service';
import { CreateProfesorDto } from './dto/create-profesor.dto';

@Injectable()
export class ProfesoresService {
  constructor(private prisma: PrismaProfesoresService) {}

  async create(createProfesorDto: CreateProfesorDto) {
    return this.prisma.docente.create({
      data: createProfesorDto,
    });
  }

  async findAll() {
    return this.prisma.docente.findMany();
  }
}